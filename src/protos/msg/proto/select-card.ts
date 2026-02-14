import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';
import {
  IndexResponse,
  IndexResponseObject,
  isIndexResponse,
} from '../index-response';

export class YGOProMsgSelectCard_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('u8', 7)
  subsequence: number;
}

export class YGOProMsgSelectCard extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_CARD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  cancelable: number;

  @BinaryField('u8', 2)
  min: number;

  @BinaryField('u8', 3)
  max: number;

  @BinaryField('u8', 4)
  count: number;

  @BinaryField(() => YGOProMsgSelectCard_CardInfo, 5, (obj) => obj.count)
  cards: YGOProMsgSelectCard_CardInfo[];

  private maskedView(playerId: number): this {
    // 参考 single_duel.cpp/tag_duel.cpp：对非当前视角玩家控制的候选卡，code 置 0
    const view = this.copy();
    for (const card of view.cards || []) {
      if (card.controller !== playerId) {
        card.code = 0;
      }
    }
    return view;
  }

  playerView(playerId: number): this {
    return this.maskedView(playerId);
  }

  responsePlayer() {
    return this.player;
  }

  defaultResponse() {
    // 只有在可以取消时才能不选择
    if (this.cancelable === 0) {
      return undefined;
    }
    return this.prepareResponse(null);
  }

  prepareResponse(
    cardOptions?: Array<
      | IndexResponseObject
      | {
          code?: number;
          controller?: number;
          location?: number;
          sequence?: number;
        }
    > | null,
  ) {
    if (cardOptions == null) {
      const buffer = new Uint8Array(4);
      const view = new DataView(buffer.buffer);
      view.setInt32(0, -1, true);
      return buffer;
    }

    const indices: number[] = [];
    const usedIndices = new Set<number>();
    for (const option of cardOptions) {
      let index: number;
      if (isIndexResponse(option)) {
        index = option.index;
        if (index < 0 || index >= this.count) {
          throw new TypeError(`Index out of range: ${index}`);
        }
      } else {
        index = this.cards.findIndex(
          (card, idx) =>
            !usedIndices.has(idx) &&
            (option.code == null || card.code === option.code) &&
            (option.controller == null ||
              card.controller === option.controller) &&
            (option.location == null || card.location === option.location) &&
            (option.sequence == null || card.sequence === option.sequence),
        );
        if (index === -1) {
          throw new TypeError('Card not found');
        }
      }
      indices.push(index);
      usedIndices.add(index);
    }

    const buffer = new Uint8Array(1 + indices.length);
    buffer[0] = indices.length;
    indices.forEach((idx, i) => {
      buffer[1 + i] = idx;
    });
    return buffer;
  }
}
