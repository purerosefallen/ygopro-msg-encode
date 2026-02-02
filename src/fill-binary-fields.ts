import { BinaryFieldInfo } from './binary-meta';
import { reflector } from './metadata';

// 共享的辅助函数
const isStaticInfo = (info: BinaryFieldInfo) =>
  typeof info.offset === 'number' &&
  (info.length == null || typeof info.length === 'number');

const resolveLength = (
  obj: any,
  length: number | ((obj: any, key: string) => number),
  key: string,
): number => {
  return typeof length === 'number' ? length : length(obj, key);
};

const getTypeSize = (type: string): number => {
  switch (type) {
    case 'i8':
    case 'u8':
      return 1;
    case 'i16':
    case 'u16':
      return 2;
    case 'i32':
    case 'u32':
      return 4;
    default:
      return 0;
  }
};

interface FieldInfo {
  key: string;
  info: BinaryFieldInfo;
}

const getFieldInfos = (objOrClass: any) => {
  const fields = reflector
    .getArray('binaryFieldKeys', objOrClass)
    .map((key) => ({ key, info: reflector.get('binaryField', objOrClass, key) }))
    .filter((s) => s.info) as FieldInfo[];

  const staticInfos = fields.filter((s) => isStaticInfo(s.info));
  const dynamicInfos = fields.filter((s) => !isStaticInfo(s.info));

  return { fields, staticInfos, dynamicInfos };
};

export const fillBinaryFields = <T = any>(
  obj: T,
  data: Uint8Array,
  useClass?: new () => T,
): number => {
  const { staticInfos, dynamicInfos } = getFieldInfos(useClass || obj);

  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const utf8Decoder = new TextDecoder('utf-8');
  const utf16Decoder = new TextDecoder('utf-16le');

  let totalSize = 0;

  const readValue = (type: string, offset: number): any => {
    switch (type) {
      case 'i8':
        return view.getInt8(offset);
      case 'u8':
        return view.getUint8(offset);
      case 'i16':
        return view.getInt16(offset, true);
      case 'u16':
        return view.getUint16(offset, true);
      case 'i32':
        return view.getInt32(offset, true);
      case 'u32':
        return view.getUint32(offset, true);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  };

  const readString = (
    type: string,
    offset: number,
    byteLength: number,
  ): string => {
    const bytes = data.slice(offset, offset + byteLength);

    // 找到第一个 \0，提前截断
    let nullIndex = -1;
    if (type === 'utf8') {
      nullIndex = bytes.indexOf(0);
    } else if (type === 'utf16') {
      // utf16 的 \0 是两个字节都为 0
      for (let i = 0; i < bytes.length - 1; i += 2) {
        if (bytes[i] === 0 && bytes[i + 1] === 0) {
          nullIndex = i;
          break;
        }
      }
    }

    const actualBytes = nullIndex >= 0 ? bytes.slice(0, nullIndex) : bytes;

    if (type === 'utf8') {
      return utf8Decoder.decode(actualBytes);
    } else if (type === 'utf16') {
      return utf16Decoder.decode(actualBytes);
    }
    throw new Error(`Unknown string type: ${type}`);
  };

  const parseField = (key: string, info: BinaryFieldInfo) => {
    const offset = resolveLength(obj, info.offset, key);
    const type = info.type;

    // 如果 type 是一个类（函数）
    if (typeof type === 'function') {
      const Constructor = type();
      if (info.length != null) {
        // 数组
        const length = resolveLength(obj, info.length, key);
        const array = [];
        let currentOffset = offset;
        for (let i = 0; i < length; i++) {
          const instance = new Constructor();
          const elementData = data.slice(currentOffset);
          const size = fillBinaryFields(instance, elementData, Constructor);
          array.push(instance);
          currentOffset += size;
        }
        (obj as any)[key] = array;
        totalSize = Math.max(totalSize, currentOffset);
      } else {
        // 单个对象
        const instance = new Constructor();
        const elementData = data.slice(offset);
        const size = fillBinaryFields(instance, elementData, Constructor);
        (obj as any)[key] = instance;
        totalSize = Math.max(totalSize, offset + size);
      }
      return;
    }

    // 字符串类型
    if (type === 'utf8' || type === 'utf16') {
      // length 表示字节长度，已在 decorator 中检查必须存在
      const byteLength = resolveLength(obj, info.length!, key);
      (obj as any)[key] = readString(type, offset, byteLength);
      totalSize = Math.max(totalSize, offset + byteLength);
      return;
    }

    // 数值类型
    const typeStr = type as string;
    const typeSize = getTypeSize(typeStr);
    if (info.length != null) {
      // 数组
      const length = resolveLength(obj, info.length, key);
      const array = [];
      for (let i = 0; i < length; i++) {
        array.push(readValue(typeStr, offset + i * typeSize));
      }
      (obj as any)[key] = array;
      totalSize = Math.max(totalSize, offset + length * typeSize);
    } else {
      // 单个值
      (obj as any)[key] = readValue(typeStr, offset);
      totalSize = Math.max(totalSize, offset + typeSize);
    }
  };

  // 先解析所有 static 字段，再按顺序解析 dynamic 字段
  // 这样 dynamic 字段可以依赖所有 static 字段和之前的 dynamic 字段
  for (const { key, info } of staticInfos) {
    parseField(key, info);
  }

  for (const { key, info } of dynamicInfos) {
    parseField(key, info);
  }

  return totalSize;
};

export const toBinaryFields = <T = any>(
  obj: T,
  useClass?: new () => T,
): Uint8Array => {
  const { staticInfos, dynamicInfos } = getFieldInfos(useClass || obj);

  // 先计算总大小
  let totalSize = 0;
  for (const { key, info } of [...staticInfos, ...dynamicInfos]) {
    const offset = resolveLength(obj, info.offset, key);
    const type = info.type;

    if (typeof type === 'function') {
      const Constructor = type();
      const value = (obj as any)[key];
      if (info.length != null) {
        // 对象数组
        const length = resolveLength(obj, info.length, key);
        let currentOffset = offset;
        for (let i = 0; i < length; i++) {
          if (value && value[i]) {
            const itemData = toBinaryFields(value[i], Constructor);
            currentOffset += itemData.length;
          }
        }
        totalSize = Math.max(totalSize, currentOffset);
      } else {
        // 单个对象
        if (value) {
          const itemData = toBinaryFields(value, Constructor);
          totalSize = Math.max(totalSize, offset + itemData.length);
        }
      }
    } else if (type === 'utf8' || type === 'utf16') {
      const byteLength = resolveLength(obj, info.length!, key);
      totalSize = Math.max(totalSize, offset + byteLength);
    } else {
      const typeSize = getTypeSize(type as string);
      if (info.length != null) {
        const length = resolveLength(obj, info.length, key);
        totalSize = Math.max(totalSize, offset + length * typeSize);
      } else {
        totalSize = Math.max(totalSize, offset + typeSize);
      }
    }
  }

  const data = new Uint8Array(totalSize);
  const view = new DataView(data.buffer);
  const utf8Encoder = new TextEncoder();

  const writeValue = (type: string, offset: number, value: number) => {
    switch (type) {
      case 'i8':
        view.setInt8(offset, value);
        break;
      case 'u8':
        view.setUint8(offset, value);
        break;
      case 'i16':
        view.setInt16(offset, value, true);
        break;
      case 'u16':
        view.setUint16(offset, value, true);
        break;
      case 'i32':
        view.setInt32(offset, value, true);
        break;
      case 'u32':
        view.setUint32(offset, value, true);
        break;
    }
  };

  const writeString = (
    type: string,
    offset: number,
    byteLength: number,
    value: string,
  ) => {
    if (type === 'utf8') {
      const encoded = utf8Encoder.encode(value);
      const len = Math.min(encoded.length, byteLength);
      data.set(encoded.slice(0, len), offset);
      // 剩余部分自动为 0（Uint8Array 默认初始化为 0）
    } else if (type === 'utf16') {
      // utf16le 编码
      for (let i = 0; i < Math.min(value.length, byteLength / 2); i++) {
        view.setUint16(offset + i * 2, value.charCodeAt(i), true);
      }
    }
  };

  const writeField = (key: string, info: BinaryFieldInfo) => {
    const offset = resolveLength(obj, info.offset, key);
    const type = info.type;
    const value = (obj as any)[key];

    if (value === undefined || value === null) {
      return; // 跳过未定义的字段
    }

    // 如果 type 是一个类（函数）
    if (typeof type === 'function') {
      const Constructor = type();
      if (info.length != null) {
        // 对象数组
        const length = resolveLength(obj, info.length, key);
        let currentOffset = offset;
        for (let i = 0; i < length; i++) {
          if (value[i]) {
            const itemData = toBinaryFields(value[i], Constructor);
            data.set(itemData, currentOffset);
            currentOffset += itemData.length;
          }
        }
      } else {
        // 单个对象
        const itemData = toBinaryFields(value, Constructor);
        data.set(itemData, offset);
      }
      return;
    }

    // 字符串类型
    if (type === 'utf8' || type === 'utf16') {
      const byteLength = resolveLength(obj, info.length!, key);
      writeString(type, offset, byteLength, value);
      return;
    }

    // 数值类型
    const typeStr = type as string;
    const typeSize = getTypeSize(typeStr);
    if (info.length != null) {
      // 数组
      const length = resolveLength(obj, info.length, key);
      for (let i = 0; i < length; i++) {
        if (value[i] !== undefined && value[i] !== null) {
          writeValue(typeStr, offset + i * typeSize, value[i]);
        }
      }
    } else {
      // 单个值
      writeValue(typeStr, offset, value);
    }
  };

  // 先写入所有 static 字段，再按顺序写入 dynamic 字段
  for (const { key, info } of staticInfos) {
    writeField(key, info);
  }

  for (const { key, info } of dynamicInfos) {
    writeField(key, info);
  }

  return data;
};
