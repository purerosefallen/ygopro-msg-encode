import {
  fillBinaryFields,
  toBinaryFields,
} from '../../binary/fill-binary-fields';
import { PayloadBase } from '../../proto-base/payload-base';
import { checkInteger, joinBytes, viewOf } from './wire';

// Packet fields are scalars, byte views, or arrays of those (decks/messages).
function copyPacketField(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(copyPacketField);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(
      value.buffer,
      value.byteOffset,
      value.byteLength,
    ).slice();
  }
  return value;
}

export class YGOProAngelusBase extends PayloadBase {
  requestId = 0;

  fromPartial(data: Partial<this>): this {
    const fields = Object.entries(data).map(([key, value]) => [
      key,
      copyPacketField(value),
    ]);
    return Object.assign(this, Object.fromEntries(fields));
  }

  // The decorators describe the fixed prefix. Variable data starts immediately
  // after the last decorated field. An ordinary fixed-size packet ends there.
  protected readTail(tail: Uint8Array): void {
    if (tail.length)
      throw new Error('Unexpected trailing Angelus payload bytes');
  }

  protected writeTail(): Uint8Array {
    return new Uint8Array(0);
  }

  protected validateFields(): void {
    // Empty and opaque bodies have no fixed fields to validate.
  }

  fromPayload(body: Uint8Array): this {
    const Packet = this.constructor as new () => this;
    const parsed = new Packet();
    parsed.requestId = this.requestId;
    const consumed = fillBinaryFields(parsed, body);
    parsed.validateFields();
    parsed.readTail(body.subarray(consumed));
    return Object.assign(this, parsed);
  }

  toPayload(): Uint8Array {
    this.validateFields();
    const prefix = toBinaryFields(this);
    const tail = this.writeTail();
    return tail.length ? joinBytes([prefix, tail]) : prefix;
  }

  protected checkRequestId(id: number): void {
    checkInteger(id, 1, 0xffffffff, 'requestId');
  }

  fromFullPayload(data: Uint8Array): this {
    if (data.length < 5) throw new Error('Truncated Angelus header');
    if (data[0] !== this.identifier) throw new Error('Angelus opcode mismatch');
    const id = viewOf(data).getUint32(1, true);
    this.checkRequestId(id);
    this.fromPayload(data.subarray(5));
    this.requestId = id;
    return this;
  }

  toFullPayload(): Uint8Array {
    this.checkRequestId(this.requestId);
    const body = this.toPayload();
    const packet = new Uint8Array(5 + body.length);
    packet[0] = this.identifier;
    viewOf(packet).setUint32(1, this.requestId, true);
    packet.set(body, 5);
    return packet;
  }
}
