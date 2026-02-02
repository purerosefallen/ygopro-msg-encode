import { PayloadBase } from '../../proto-base/payload-base';

// STOC base class only handles the body part
// Format: [length 2 bytes][identifier 1 byte][body]
// This class only deals with [body]
export class YGOProStocBase extends PayloadBase {
  /**
   * Serialize to full payload including header (length + identifier + body)
   * Format: [length 2 bytes LE][identifier 1 byte][body]
   * Length = 1 (identifier) + body.length
   */
  toFullPayload(): Uint8Array {
    const body = this.toPayload();
    const length = 1 + body.length;
    const fullPayload = new Uint8Array(3 + body.length);

    // Write length (2 bytes, little endian)
    fullPayload[0] = length & 0xff;
    fullPayload[1] = (length >> 8) & 0xff;

    // Write identifier (1 byte)
    fullPayload[2] = this.identifier;

    // Write body
    fullPayload.set(body, 3);

    return fullPayload;
  }

  /**
   * Deserialize from full payload including header (length + identifier + body)
   * Format: [length 2 bytes LE][identifier 1 byte][body]
   * @param data - Full payload data
   * @returns this instance
   * @throws Error if data is too short or identifier mismatch
   */
  fromFullPayload(data: Uint8Array): this {
    if (data.length < 3) {
      throw new Error(
        `STOC payload too short: expected at least 3 bytes, got ${data.length}`,
      );
    }

    // Read length (2 bytes, little endian)
    const declaredLength = data[0] | (data[1] << 8);

    // Read identifier (1 byte)
    const identifier = data[2];

    // Verify identifier matches
    if (identifier !== this.identifier) {
      throw new Error(
        `STOC identifier mismatch: expected 0x${this.identifier.toString(16)}, got 0x${identifier.toString(16)}`,
      );
    }

    // Calculate expected total length (3 bytes header + body)
    const expectedTotalLength = 3 + declaredLength - 1; // -1 because length includes identifier

    // Check if data length is less than declared
    if (data.length < expectedTotalLength) {
      throw new Error(
        `STOC payload too short: declared length ${declaredLength} requires ${expectedTotalLength} bytes total, got ${data.length}`,
      );
    }

    // Truncate if data is longer than declared
    const bodyData =
      data.length > expectedTotalLength
        ? data.slice(3, expectedTotalLength)
        : data.slice(3);

    // Parse body
    return this.fromPayload(bodyData);
  }
}
