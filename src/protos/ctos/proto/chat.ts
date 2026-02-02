import { YGOProCtosBase } from '../base';

// CTOS_CHAT: uint16_t array (UTF-16 string)
// Variable length: sends actual content + null terminator if not full
export class YGOProCtosChat extends YGOProCtosBase {
  static identifier = 0x16;

  msg: string;

  constructor() {
    super();
    this.msg = '';
  }

  fromPayload(data: Uint8Array): this {
    // Decode UTF-16LE from all available bytes
    const decoder = new TextDecoder('utf-16le');
    this.msg = decoder.decode(data).replace(/\0+$/, ''); // Remove trailing nulls
    return this;
  }

  toPayload(): Uint8Array {
    // Encode to UTF-16LE
    const encoder = new TextEncoder();
    const utf8 = encoder.encode(this.msg);
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(utf8);

    // Convert to UTF-16LE manually
    const utf16 = new Uint16Array(text.length + 1); // +1 for null terminator
    for (let i = 0; i < text.length; i++) {
      utf16[i] = text.charCodeAt(i);
    }
    utf16[text.length] = 0; // Null terminator

    // Convert to bytes (little endian)
    const result = new Uint8Array(utf16.buffer);
    return result;
  }

  fromPartial(data: Partial<this>): this {
    if (data.msg !== undefined) {
      this.msg = data.msg;
    }
    return this;
  }
}
