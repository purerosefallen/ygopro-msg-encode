import { YGOProCtosBase } from '../base';

export class YGOProCtosResponse extends YGOProCtosBase {
  static identifier = 0x1;

  // byte array - variable length, entire payload
  response: Uint8Array;

  fromPayload(data: Uint8Array): this {
    this.response = data;
    return this;
  }

  toPayload(): Uint8Array {
    return this.response || new Uint8Array(0);
  }
}
