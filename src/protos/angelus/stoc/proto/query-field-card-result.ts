import { YGOProAngelusStocBase } from '../base';

export class YGOProAngelusQueryFieldCardResult extends YGOProAngelusStocBase {
  static identifier = 0x85;
  raw: Uint8Array = new Uint8Array(0);

  fromPayload(data: Uint8Array): this {
    this.raw = data;
    return this;
  }

  toPayload(): Uint8Array {
    return this.raw;
  }
}
