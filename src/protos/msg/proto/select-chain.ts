import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';
import {
  IndexResponse,
  IndexResponseObject,
  isIndexResponse,
} from '../index-response';

export class YGOProMsgSelectChain_ChainInfo {
  @BinaryField('u8', 0)
  edesc: number;

  @BinaryField('u8', 1)
  forced: number;

  @BinaryField('i32', 2)
  code: number;

  @BinaryField('u8', 6)
  controller: number;

  @BinaryField('u8', 7)
  location: number;

  @BinaryField('u8', 8)
  sequence: number;

  @BinaryField('u8', 9)
  subsequence: number;

  @BinaryField('i32', 10)
  desc: number;
}

export class YGOProMsgSelectChain extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_CHAIN;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('u8', 2)
  specialCount: number;

  @BinaryField('i32', 3)
  hint0: number;

  @BinaryField('i32', 7)
  hint1: number;

  @BinaryField(() => YGOProMsgSelectChain_ChainInfo, 11, (obj) => obj.count)
  chains: YGOProMsgSelectChain_ChainInfo[];

  responsePlayer() {
    return this.player;
  }

  defaultResponse() {
    // 只有在没有强制连锁时才能不激活
    const hasForced = this.chains.some((chain) => chain.forced !== 0);
    if (hasForced) {
      return undefined;
    }
    return this.prepareResponse(null);
  }

  prepareResponse(
    option?:
      | IndexResponseObject
      | {
          code?: number;
          controller?: number;
          location?: number;
          sequence?: number;
          desc?: number;
        }
      | null,
  ) {
    let index: number;

    if (option == null) {
      index = -1;
    } else if (isIndexResponse(option)) {
      index = option.index;
      if (index < -1 || index >= this.count) {
        throw new TypeError(`Index out of range: ${index}`);
      }
    } else {
      index = this.chains.findIndex(
        (chain) =>
          (option.code == null || chain.code === option.code) &&
          (option.controller == null ||
            chain.controller === option.controller) &&
          (option.location == null || chain.location === option.location) &&
          (option.sequence == null || chain.sequence === option.sequence) &&
          (option.desc == null || chain.desc === option.desc),
      );
      if (index === -1) {
        throw new TypeError('Chain not found');
      }
    }

    const buffer = new Uint8Array(4);
    const view = new DataView(buffer.buffer);
    view.setInt32(0, index, true);
    return buffer;
  }
}
