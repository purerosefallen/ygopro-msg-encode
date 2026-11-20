import { YGOProAngelusCtosBase } from '../base';
import { checkInteger } from '../../wire';

export class YGOProAngelusResponse extends YGOProAngelusCtosBase {
  static identifier = 0x03;
  response: Uint8Array = new Uint8Array(0);

  fromPayload(data: Uint8Array): this {
    checkInteger(data.length, 1, 255, 'response length');
    this.response = data;
    return this;
  }

  toPayload(): Uint8Array {
    checkInteger(this.response.length, 1, 255, 'response length');
    return this.response;
  }
}
