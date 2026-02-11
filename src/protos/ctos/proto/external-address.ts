import { YGOProCtosBase } from '../base';

// CTOS_EXTERNAL_ADDRESS
// uint32_t real_ip; (IPv4 address, BE, always 0 in normal client)
// uint16_t hostname[256]; (UTF-16 string, variable length)
// Maximum hostname length: 256 characters (LEN_HOSTNAME in YGOPro)
export class YGOProCtosExternalAddress extends YGOProCtosBase {
  static identifier = 0x17;
  static readonly MAX_HOSTNAME_LENGTH = 256;

  real_ip: string; // IPv4 address as string (e.g., "127.0.0.1" or "::ffff:127.0.0.1")
  hostname: string;

  constructor() {
    super();
    this.real_ip = '0.0.0.0';
    this.hostname = '';
  }

  // Convert IPv4 string to uint32 (network byte order / big endian)
  private ipToUint32(ip: string): number {
    // Handle IPv6-mapped IPv4 addresses (::ffff:x.x.x.x)
    let ipv4 = ip;
    if (ip.startsWith('::ffff:')) {
      ipv4 = ip.substring(7);
    }

    const parts = ipv4.split('.');
    if (parts.length !== 4) {
      return 0; // Invalid IP, return 0
    }

    const bytes = parts.map((p) => parseInt(p, 10));
    if (bytes.some((b) => isNaN(b) || b < 0 || b > 255)) {
      return 0; // Invalid IP, return 0
    }

    // Network byte order (big endian)
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  }

  // Convert uint32 (network byte order / big endian) to IPv4 string
  private uint32ToIp(value: number): string {
    const byte1 = (value >>> 24) & 0xff;
    const byte2 = (value >>> 16) & 0xff;
    const byte3 = (value >>> 8) & 0xff;
    const byte4 = value & 0xff;
    return `${byte1}.${byte2}.${byte3}.${byte4}`;
  }

  fromPayload(data: Uint8Array): this {
    if (data.length < 4) {
      throw new Error('CTOS_EXTERNAL_ADDRESS data too short');
    }

    // Read real_ip (4 bytes, big endian / network byte order)
    const ipUint32 =
      (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
    this.real_ip = this.uint32ToIp(ipUint32);

    // Decode remaining bytes as UTF-16LE
    if (data.length > 4) {
      const decoder = new TextDecoder('utf-16le');
      this.hostname = decoder.decode(data.slice(4)).replace(/\0+$/, ''); // Remove trailing nulls
    } else {
      this.hostname = '';
    }

    return this;
  }

  toPayload(): Uint8Array {
    // Truncate hostname to maximum length (256 characters)
    const text =
      this.hostname.length > YGOProCtosExternalAddress.MAX_HOSTNAME_LENGTH
        ? this.hostname.substring(
            0,
            YGOProCtosExternalAddress.MAX_HOSTNAME_LENGTH,
          )
        : this.hostname;

    // Convert to UTF-16LE manually
    const utf16 = new Uint16Array(text.length + 1); // +1 for null terminator
    for (let i = 0; i < text.length; i++) {
      utf16[i] = text.charCodeAt(i);
    }
    utf16[text.length] = 0; // Null terminator

    // Create result buffer: real_ip (4 bytes) + UTF-16LE string
    const result = new Uint8Array(4 + utf16.byteLength);

    // Convert real_ip string to uint32 and write (big endian / network byte order)
    const ipUint32 = this.ipToUint32(this.real_ip);
    result[0] = (ipUint32 >>> 24) & 0xff;
    result[1] = (ipUint32 >>> 16) & 0xff;
    result[2] = (ipUint32 >>> 8) & 0xff;
    result[3] = ipUint32 & 0xff;

    // Write UTF-16LE string
    result.set(new Uint8Array(utf16.buffer), 4);

    return result;
  }

  fromPartial(data: Partial<this>): this {
    if (data.real_ip !== undefined) {
      this.real_ip = data.real_ip;
    }
    if (data.hostname !== undefined) {
      this.hostname = data.hostname;
    }
    return this;
  }
}
