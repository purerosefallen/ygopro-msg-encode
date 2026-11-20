import { YGOProAngelusStocBase } from '../base';
import {
  decodeRegistry,
  encodeRegistry,
  visitRegistry,
} from '../../registry-dump';

export class YGOProAngelusFinishOk extends YGOProAngelusStocBase {
  static identifier = 0x88;
  registry: Uint8Array = new Uint8Array(0);

  fromPayload(data: Uint8Array): this {
    visitRegistry(data);
    this.registry = data;
    return this;
  }

  toPayload(): Uint8Array {
    visitRegistry(this.registry);
    return this.registry;
  }

  decodeRegistry(): Record<string, string> {
    return decodeRegistry(this.registry);
  }

  setRegistry(entries: Record<string, string>): this {
    this.registry = encodeRegistry(entries);
    return this;
  }
}
