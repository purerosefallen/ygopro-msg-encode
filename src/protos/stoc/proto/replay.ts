import { YGOProYrp } from 'ygopro-yrp-encode';
import { YGOProStocBase } from '../base';

// STOC_REPLAY: ExtendedReplayHeader + byte array
// Uses ygopro-yrp-encode
export class YGOProStocReplay extends YGOProStocBase {
  static identifier = 0x17;

  replay: YGOProYrp;

  constructor() {
    super();
    this.replay = new YGOProYrp();
  }

  fromPayload(data: Uint8Array): this {
    this.replay = new YGOProYrp().fromYrp(data);
    return this;
  }

  toPayload(): Uint8Array {
    return this.replay.toYrp();
  }

  fromPartial(data: Partial<this>): this {
    if (data.replay) {
      // Pass replay data to constructor
      this.replay = new YGOProYrp(data.replay);
    }
    return this;
  }

  copy(): this {
    const copied = new (this.constructor as any)();
    copied.replay = new YGOProYrp(this.replay);
    return copied;
  }
}
