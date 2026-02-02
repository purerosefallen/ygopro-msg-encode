import { YGOProStocBase } from '../base';

// STOC_CHAT: uint16_t + uint16_t array
// uint16_t player_type; (can be NetPlayerType 0-7 or ChatColor 8-19)
// uint16_t msg[256]; (UTF-16 string, variable length)
export class YGOProStocChat extends YGOProStocBase {
  static identifier = 0x19;

  player_type: number; // NetPlayerType (0-7) or ChatColor (8-19)
  msg: string;

  constructor() {
    super();
    this.player_type = 0;
    this.msg = '';
  }

  fromPayload(data: Uint8Array): this {
    if (data.length < 2) {
      throw new Error('STOC_CHAT data too short');
    }

    // Read player_type (2 bytes, little endian)
    this.player_type = data[0] | (data[1] << 8);

    // Decode remaining bytes as UTF-16LE
    if (data.length > 2) {
      const decoder = new TextDecoder('utf-16le');
      this.msg = decoder.decode(data.slice(2)).replace(/\0+$/, ''); // Remove trailing nulls
    } else {
      this.msg = '';
    }

    return this;
  }

  toPayload(): Uint8Array {
    // Encode message to UTF-16LE
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

    // Create result buffer: player_type (2 bytes) + UTF-16LE string
    const result = new Uint8Array(2 + utf16.byteLength);

    // Write player_type (little endian)
    result[0] = this.player_type & 0xff;
    result[1] = (this.player_type >> 8) & 0xff;

    // Write UTF-16LE string
    result.set(new Uint8Array(utf16.buffer), 2);

    return result;
  }

  fromPartial(data: Partial<this>): this {
    if (data.player_type !== undefined) {
      this.player_type = data.player_type;
    }
    if (data.msg !== undefined) {
      this.msg = data.msg;
    }
    return this;
  }
}
