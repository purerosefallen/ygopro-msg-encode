import { YGOProMessages } from '../../msg/registry';
import { YGOProMsgBase } from '../../msg/base';
import { YGOProStocBase } from '../base';

// STOC_GAME_MSG: byte array (MSG protocol)
// Uses YGOProMessages registry to parse MSG protocol
export class YGOProStocGameMsg extends YGOProStocBase {
  static identifier = 0x1;

  // Parsed MSG protocol message
  msg: YGOProMsgBase | undefined;

  fromPayload(data: Uint8Array): this {
    this.msg = YGOProMessages.getInstanceFromPayload(data);
    return this;
  }

  toPayload(): Uint8Array {
    if (!this.msg) {
      return new Uint8Array(0);
    }
    return this.msg.toPayload();
  }

  fromPartial(data: Partial<this>): this {
    if (data.msg) {
      // Copy the msg object
      this.msg = data.msg.copy();
    }
    return this;
  }
}
