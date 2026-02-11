import { YGOProCtosBase } from '../base';

// CTOS_CHAT: uint16_t array (UTF-16 string)
// Variable length: sends actual content + null terminator if not full
// Maximum length: 256 characters (LEN_CHAT_MSG in YGOPro)
// Client typically limits to 255 characters (setMax(LEN_CHAT_MSG - 1))
export class YGOProCtosChat extends YGOProCtosBase {
  static identifier = 0x16;
  static readonly MAX_LENGTH = 256;

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
    // Truncate message to maximum length (256 characters)
    const text =
      this.msg.length > YGOProCtosChat.MAX_LENGTH
        ? this.msg.substring(0, YGOProCtosChat.MAX_LENGTH)
        : this.msg;

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
