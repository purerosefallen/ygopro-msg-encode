import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

// MSG_UPDATE_CARD 的结构比较特殊，包含可变长度的查询数据
// 需要手动处理，因为它的结构由 query_flag 决定
export class YGOProMsgUpdateCard extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_UPDATE_CARD;

  controller: number;
  location: number;
  sequence: number;
  queryData: Uint8Array;

  fromPayload(data: Uint8Array): this {
    if (data.length < 1) {
      throw new Error('MSG data too short');
    }
    const msgType = data[0];
    if (msgType !== this.identifier) {
      throw new Error(
        `MSG type mismatch: expected ${this.identifier}, got ${msgType}`,
      );
    }
    if (data.length < 4) {
      throw new Error('MSG_UPDATE_CARD data too short');
    }
    this.controller = data[1];
    this.location = data[2];
    this.sequence = data[3];
    this.queryData = data.slice(4);
    return this;
  }

  toPayload(): Uint8Array {
    const result = new Uint8Array(4 + this.queryData.length);
    result[0] = this.identifier;
    result[1] = this.controller;
    result[2] = this.location;
    result[3] = this.sequence;
    result.set(this.queryData, 4);
    return result;
  }
}
