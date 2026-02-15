import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { NetPlayerType } from '../../network-enums';
import { YGOProMsgBase } from '../base';
import {
  CardQuery,
  createClearedCardQuery,
  parseCardQueryChunk,
  serializeCardQueryChunk,
} from '../../common/card-query';

// MSG_UPDATE_DATA 的结构：更新某个位置所有卡片的信息
export class YGOProMsgUpdateData extends YGOProMsgBase {
  static identifier = 6; // MSG_UPDATE_DATA

  player: number;
  location: number;
  cards: CardQuery[];

  private shouldHideForOpponent(card: CardQuery): boolean {
    if (this.location === OcgcoreScriptConstants.LOCATION_GRAVE) {
      return false;
    }
    if (this.location === OcgcoreScriptConstants.LOCATION_HAND) {
      return (
        !card.position || !(card.position & OcgcoreCommonConstants.POS_FACEUP)
      );
    }
    return !!(
      card.position && card.position & OcgcoreCommonConstants.POS_FACEDOWN
    );
  }

  private shouldHideForTeammate(card: CardQuery): boolean {
    if (
      this.location === OcgcoreScriptConstants.LOCATION_MZONE ||
      this.location === OcgcoreScriptConstants.LOCATION_SZONE ||
      this.location === OcgcoreScriptConstants.LOCATION_REMOVED ||
      this.location === OcgcoreScriptConstants.LOCATION_GRAVE
    ) {
      return false;
    }
    if (this.location === OcgcoreScriptConstants.LOCATION_HAND) {
      return (
        !card.position || !(card.position & OcgcoreCommonConstants.POS_FACEUP)
      );
    }
    if (this.location === OcgcoreScriptConstants.LOCATION_EXTRA) {
      return !!(
        card.position && card.position & OcgcoreCommonConstants.POS_FACEDOWN
      );
    }
    return false;
  }

  opponentView(): this {
    const copy = this.copy();
    if (copy.cards) {
      copy.cards = copy.cards.map((card) => {
        if (this.shouldHideForOpponent(card)) {
          return createClearedCardQuery(card);
        }
        return card;
      });
    }
    return copy;
  }

  teammateView(): this {
    const copy = this.copy();
    if (copy.cards) {
      copy.cards = copy.cards.map((card) => {
        if (this.shouldHideForTeammate(card)) {
          return createClearedCardQuery(card);
        }
        return card;
      });
    }
    return copy;
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

    this.cards = [];
    let offset = 3;

    while (offset < data.length) {
      const { card, length } = parseCardQueryChunk(
        data,
        offset,
        'MSG_UPDATE_DATA',
      );
      this.cards.push(card);
      offset += length;
    }

    return this;
  }

  toPayload(): Uint8Array {
    let totalSize = 3; // identifier + player + location

    const chunks: ReturnType<typeof serializeCardQueryChunk>[] = [];
    for (const card of this.cards || []) {
      const chunk = serializeCardQueryChunk(card);
      chunks.push(chunk);
      totalSize += chunk.length;
    }

    const result = new Uint8Array(totalSize);
    const view = new DataView(result.buffer);
    let offset = 0;

    result[offset++] = this.identifier;
    result[offset++] = this.player;
    result[offset++] = this.location;

    for (const chunk of chunks) {
      view.setInt32(offset, chunk.length, true);
      offset += 4;
      if (chunk.payload.length > 0) {
        result.set(chunk.payload, offset);
        offset += chunk.payload.length;
      }
    }

    return result;
  }
}
