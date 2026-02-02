import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgBase } from '../base';
import { CardQuery } from './card-query';

// MSG_UPDATE_DATA 的结构：更新某个位置所有卡片的信息
export class YGOProMsgUpdateData extends YGOProMsgBase {
  static identifier = 6; // MSG_UPDATE_DATA

  player: number;
  location: number;
  cards: CardQuery[];

  opponentView(): this {
    const copy = this.copy();
    // 对于每张盖放的卡片，清除查询数据（只保留长度字段，所有数据清零）
    if (copy.cards) {
      copy.cards = copy.cards.map((card) => {
        if (card.position && (card.position & OcgcoreCommonConstants.POS_FACEDOWN)) {
          // 盖放的卡片，清除所有查询数据
          const clearedCard = new CardQuery();
          clearedCard.flags = 0;
          clearedCard.empty = true;
          return clearedCard;
        }
        return card;
      });
    }
    return copy;
  }

  teammateView(): this {
    // TAG 决斗中，队友的视角规则（参考 tag_duel.cpp）：
    // - MZONE/SZONE：队友可以看到己方盖放的卡片（RefreshMzone/RefreshSzone 发给同队两个玩家）
    // - HAND：队友也看不到非公开的手牌（RefreshHand 只发给当前操作玩家完整数据）
    // - 其他公开区域（GRAVE 等）：所有人都能看到
    
    if (
      this.location === OcgcoreScriptConstants.LOCATION_MZONE ||
      this.location === OcgcoreScriptConstants.LOCATION_SZONE
    ) {
      // 场上区域，队友可以看到完整数据（包括盖放）
      return this.copy();
    } else if (this.location === OcgcoreScriptConstants.LOCATION_HAND) {
      // 手牌区域，队友也看不到非公开的卡片
      const copy = this.copy();
      if (copy.cards) {
        copy.cards = copy.cards.map((card) => {
          // 只有表侧（公开）的手牌才能被看到
          if (!card.position || !(card.position & OcgcoreCommonConstants.POS_FACEUP)) {
            const clearedCard = new CardQuery();
            clearedCard.flags = 0;
            clearedCard.empty = true;
            return clearedCard;
          }
          return card;
        });
      }
      return copy;
    } else {
      // 其他区域（墓地、除外等），通常是公开的
      return this.copy();
    }
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
    if (data.length < 3) {
      throw new Error('MSG_UPDATE_DATA data too short');
    }

    this.player = data[1];
    this.location = data[2];

    // 解析多个卡片的查询数据
    this.cards = [];
    let offset = 3;
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

    while (offset + 4 <= data.length) {
      const chunkLen = view.getInt32(offset, true);
      if (chunkLen <= 0) {
        break;
      }

      const end = Math.min(data.length, offset + chunkLen);

      if (chunkLen <= 4) {
        // 空卡片
        const card = new CardQuery();
        card.flags = 0;
        card.empty = true;
        this.cards.push(card);
      } else {
        // 跳过长度字段，从 flags 开始解析
        const cardQueryData = data.slice(offset + 4, end);
        const card = new CardQuery();
        card.fromPayload(cardQueryData);
        this.cards.push(card);
      }

      offset += chunkLen;
    }

    return this;
  }

  toPayload(): Uint8Array {
    // 计算总大小
    let totalSize = 3; // identifier + player + location

    const cardPayloads: Uint8Array[] = [];
    for (const card of this.cards || []) {
      const payload = card.toPayload();
      cardPayloads.push(payload);
      totalSize += 4 + payload.length; // 长度字段 + 数据
    }

    const result = new Uint8Array(totalSize);
    const view = new DataView(result.buffer);
    let offset = 0;

    result[offset++] = this.identifier;
    result[offset++] = this.player;
    result[offset++] = this.location;

    // 写入每个卡片的数据
    for (const payload of cardPayloads) {
      const length = 4 + payload.length;
      view.setInt32(offset, length, true);
      offset += 4;
      result.set(payload, offset);
      offset += payload.length;
    }

    return result;
  }
}
