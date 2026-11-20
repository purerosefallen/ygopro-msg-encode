// Internal primitives shared by the variable-length Angelus bodies.
export function viewOf(bytes: Uint8Array): DataView {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

export function checkInteger(
  value: number,
  min: number,
  max: number,
  field: string,
) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${field} must be an integer in [${min}, ${max}]`);
  }
}

export function joinBytes(parts: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(
    parts.reduce((sum, part) => sum + part.length, 0),
  );
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

export const utf8Encoder = new TextEncoder();
export const utf8Decoder = new TextDecoder('utf-8', {
  fatal: true,
  ignoreBOM: true,
});
