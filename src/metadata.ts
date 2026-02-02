import { MetadataSetter, Reflector } from 'typed-reflector';
import { BinaryFieldInfo } from './binary/binary-meta';

export interface MetadataMap {
  binaryField: BinaryFieldInfo;
}

export interface MetadataArrayMap {
  binaryFieldKeys: string;
}

export const Metadata = new MetadataSetter<MetadataMap, MetadataArrayMap>();
export const reflector = new Reflector<MetadataMap, MetadataArrayMap>();
