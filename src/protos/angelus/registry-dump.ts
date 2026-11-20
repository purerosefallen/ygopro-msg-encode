import {
  checkInteger,
  joinBytes,
  utf8Decoder,
  utf8Encoder,
  viewOf,
} from './wire';

export function visitRegistry(
  raw: Uint8Array,
  visitor?: (key: Uint8Array, value: Uint8Array) => void,
): void {
  const view = viewOf(raw);
  for (let offset = 0; offset < raw.length; ) {
    if (raw.length - offset < 4)
      throw new Error('Truncated registry entry header');
    const keyLength = view.getUint16(offset, true);
    const valueLength = view.getUint16(offset + 2, true);
    const keyStart = offset + 4;
    const valueStart = keyStart + keyLength;
    offset = valueStart + valueLength;
    if (offset > raw.length) throw new Error('Truncated registry entry data');
    visitor?.(
      raw.subarray(keyStart, valueStart),
      raw.subarray(valueStart, offset),
    );
  }
}

export function decodeRegistry(raw: Uint8Array): Record<string, string> {
  const entries: Record<string, string> = Object.create(null);
  visitRegistry(raw, (key, value) => {
    entries[utf8Decoder.decode(key)] = utf8Decoder.decode(value);
  });
  return entries;
}

export function encodeRegistry(entries: Record<string, string>): Uint8Array {
  const parts: Uint8Array[] = [];
  for (const [key, value] of Object.entries(entries)) {
    const keyBytes = utf8Encoder.encode(key);
    const valueBytes = utf8Encoder.encode(value);
    checkInteger(keyBytes.length, 0, 0xffff, 'registry key length');
    checkInteger(valueBytes.length, 0, 0xffff, 'registry value length');
    const header = new Uint8Array(4);
    const view = viewOf(header);
    view.setUint16(0, keyBytes.length, true);
    view.setUint16(2, valueBytes.length, true);
    parts.push(header, keyBytes, valueBytes);
  }
  return joinBytes(parts);
}
