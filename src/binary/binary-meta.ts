import { Metadata } from '../metadata';

export interface BinaryTypes {
  i8: number;
  u8: number;
  i16: number;
  u16: number;
  i32: number;
  u32: number;
  utf8: string;
  utf16: string;
}

export type BinaryType = keyof BinaryTypes | (() => new () => any);
export type Length = number | ((obj: any, key: string) => number);

export interface BinaryFieldOptions {
  enum?: Readonly<Record<string, string | number>>;
}

export interface BinaryFieldInfo {
  type: BinaryType;
  offset: Length;
  length?: Length;
  enumValues?: ReadonlySet<string | number>;
}

export const BinaryField = (
  type: BinaryType,
  offset: Length,
  length?: Length,
  options?: BinaryFieldOptions,
) => {
  // utf8/utf16 必须指定 length
  // utf16: length 表示字符数（每个字符占 2 字节）
  // utf8: length 表示字节数
  if ((type === 'utf8' || type === 'utf16') && length == null) {
    throw new Error(`String type ${type} requires length parameter`);
  }
  const enumDefinition = options?.enum;
  const enumValues =
    enumDefinition &&
    new Set(
      Object.entries(enumDefinition)
        .filter(([key, value]) => {
          // TypeScript numeric enums also map numeric keys back to member names.
          const member = typeof value === 'string' && enumDefinition[value];
          return typeof member !== 'number' || String(member) !== key;
        })
        .map(([, value]) => value),
    );
  return Metadata.set(
    'binaryField',
    { type, offset, length, enumValues },
    'binaryFieldKeys',
  );
};
