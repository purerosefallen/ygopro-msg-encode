import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgBase } from '../base';
import { CardQuery } from './card-query';

// MSG_UPDATE_CARD 的结构：更新单张卡片的信息
export class YGOProMsgUpdateCard extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_UPDATE_CARD;

  controller: number;
  location: number;
  sequence: number;
  card: CardQuery;

  opponentView(): this {
    const copy = this.copy();
    // 如果卡片是盖放的，清除查询数据（只保留 flags = QUERY_CODE，code = 0）
    if (copy.card?.position && (copy.card.position & OcgcoreCommonConstants.POS_FACEDOWN)) {
      const clearedCard = new CardQuery();
      clearedCard.flags = OcgcoreCommonConstants.QUERY_CODE;
      clearedCard.code = 0;
      clearedCard.empty = false;
      copy.card = clearedCard;
    }
    return copy;
  }

  teammateView(): this {
    // TAG 决斗中，队友的视角规则：
    // - 场上卡片 (LOCATION_ONFIELD)：队友可以看到己方盖放的卡片
    // - 其他位置：和对手视角相同（根据 tag_duel.cpp RefreshSingle）
    if (this.location & OcgcoreScriptConstants.LOCATION_ONFIELD) {
      // 场上卡片，队友可以看到完整数据
      return this.copy();
    } else {
      // 非场上卡片，使用对手视角
      return this.opponentView();
    }
  }

  playerView(playerId: number): this {
    // MSG_UPDATE_CARD 的字段名是 controller，不是 player
    // 所以需要重写 playerView 方法
    if (this.controller === playerId) {
      return this.copy();
    }
    return this.opponentView();
  }

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

    // 解析查询数据，前 4 字节是长度
    const queryDataWithLength = data.slice(4);
    if (queryDataWithLength.length < 8) {
      throw new Error('Query data too short');
    }

    const view = new DataView(
      queryDataWithLength.buffer,
      queryDataWithLength.byteOffset,
      queryDataWithLength.byteLength,
    );
    const length = view.getInt32(0, true);

    // 跳过长度字段，从 flags 开始解析
    const cardQueryData = queryDataWithLength.slice(4, length);
    this.card = new CardQuery();
    this.card.fromPayload(cardQueryData);

    return this;
  }

  toPayload(): Uint8Array {
    const cardPayload = this.card?.toPayload() || new Uint8Array(4); // 至少包含 flags
    const length = 4 + cardPayload.length; // 长度字段本身 + 查询数据

    const result = new Uint8Array(4 + length);
    const view = new DataView(result.buffer);

    result[0] = this.identifier;
    result[1] = this.controller;
    result[2] = this.location;
    result[3] = this.sequence;

    // 写入长度
    view.setInt32(4, length, true);

    // 写入查询数据
    result.set(cardPayload, 8);

    return result;
  }
}
