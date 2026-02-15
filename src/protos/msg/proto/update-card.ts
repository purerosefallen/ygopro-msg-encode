import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { NetPlayerType } from '../../network-enums';
import { YGOProMsgBase } from '../base';
import {
  CardQuery,
  createCodeHiddenCardQuery,
  parseCardQueryChunk,
  serializeCardQueryChunk,
} from '../../common/card-query';
import { RequireQueryCardLocation } from '../query-location';

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
    if (
      copy.card?.position &&
      copy.card.position & OcgcoreCommonConstants.POS_FACEDOWN
    ) {
      copy.card = createCodeHiddenCardQuery(copy.card);
    }
    return copy;
  }

  teammateView(): this {
    // TAG 决斗中，RefreshSingle 总是先把完整 UPDATE_CARD 发给同队玩家
    // （包括场上背面、手牌/卡组等非公开区域）
    return this.copy();
  }

  playerView(playerId: number): this {
    // MSG_UPDATE_CARD 的字段名是 controller，不是 player
    // 所以需要重写 playerView 方法
    if (playerId === NetPlayerType.OBSERVER) {
      return this.observerView();
    }
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

    const queryDataWithLength = data.slice(4);
    const { card } = parseCardQueryChunk(
      queryDataWithLength,
      0,
      'MSG_UPDATE_CARD',
    );
    this.card = card;

    return this;
  }

  toPayload(): Uint8Array {
    const chunk = serializeCardQueryChunk(this.card);
    const result = new Uint8Array(4 + chunk.length);
    const view = new DataView(result.buffer);

    result[0] = this.identifier;
    result[1] = this.controller;
    result[2] = this.location;
    result[3] = this.sequence;

    // 写入长度
    view.setInt32(4, chunk.length, true);

    if (chunk.payload.length > 0) {
      result.set(chunk.payload, 8);
    }

    return result;
  }

  getRequireRefreshCards(): RequireQueryCardLocation[] {
    return [
      {
        player: this.controller,
        location: this.location,
        sequence: this.sequence,
      },
    ];
  }
}
