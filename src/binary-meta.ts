import { Metadata } from "./metadata";

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

export interface BinaryFieldInfo {
  type: BinaryType;
  offset: Length;
  length?: Length;
}

export const BinaryField = (type: BinaryType, offset: Length, length?: Length) => {
  // utf8/utf16 必须指定 length
  if ((type === 'utf8' || type === 'utf16') && length == null) {
    throw new Error(`String type ${type} requires length parameter`);
  }
  return Metadata.set('binaryField', { type, offset, length }, 'binaryFieldKeys');
};
