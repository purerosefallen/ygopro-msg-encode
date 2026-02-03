import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';
import {
  IndexResponse,
  IndexResponseObject,
  isIndexResponse,
} from '../index-response';

export class YGOProMsgSelectUnselectCard_CardInfo {
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

export class YGOProMsgSelectUnselectCard extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_UNSELECT_CARD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  finishable: number;

  @BinaryField('u8', 2)
  cancelable: number;

  @BinaryField('u8', 3)
  min: number;

  @BinaryField('u8', 4)
  max: number;

  @BinaryField('u8', 5)
  selectableCount: number;

  @BinaryField(
    () => YGOProMsgSelectUnselectCard_CardInfo,
    6,
    (obj) => obj.selectableCount,
  )
  selectableCards: YGOProMsgSelectUnselectCard_CardInfo[];

  @BinaryField('u8', (obj) => {
    return 6 + obj.selectableCount * 8;
  })
  unselectableCount: number;

  @BinaryField(
    () => YGOProMsgSelectUnselectCard_CardInfo,
    (obj) => {
      return 7 + obj.selectableCount * 8;
    },
    (obj) => obj.unselectableCount,
  )
  unselectableCards: YGOProMsgSelectUnselectCard_CardInfo[];

  responsePlayer() {
    return this.player;
  }

  defaultResponse() {
    // 只有在可以取消或完成时才能不选择
    if (this.cancelable === 0 && this.finishable === 0) {
      return undefined;
    }
    return this.prepareResponse(null);
  }

  prepareResponse(
    cardOption?:
      | IndexResponseObject
      | {
          code?: number;
          controller?: number;
          location?: number;
          sequence?: number;
        }
      | null,
  ) {
    if (cardOption == null) {
      const buffer = new Uint8Array(4);
      const view = new DataView(buffer.buffer);
      view.setInt32(0, -1, true);
      return buffer;
    }

    let index: number;
    if (isIndexResponse(cardOption)) {
      index = cardOption.index;
      const totalCount = this.selectableCount + this.unselectableCount;
      if (index < 0 || index >= totalCount) {
        throw new TypeError(`Index out of range: ${index}`);
      }
    } else {
      // 先在 selectable 中查找
      index = this.selectableCards.findIndex(
        (card) =>
          (cardOption.code == null || card.code === cardOption.code) &&
          (cardOption.controller == null ||
            card.controller === cardOption.controller) &&
          (cardOption.location == null ||
            card.location === cardOption.location) &&
          (cardOption.sequence == null ||
            card.sequence === cardOption.sequence),
      );
      // 如果没找到，在 unselectable 中查找
      if (index === -1) {
        const unselectIndex = this.unselectableCards.findIndex(
          (card) =>
            (cardOption.code == null || card.code === cardOption.code) &&
            (cardOption.controller == null ||
              card.controller === cardOption.controller) &&
            (cardOption.location == null ||
              card.location === cardOption.location) &&
            (cardOption.sequence == null ||
              card.sequence === cardOption.sequence),
        );
        if (unselectIndex === -1) {
          throw new TypeError('Card not found');
        }
        index = this.selectableCount + unselectIndex;
      }
    }

    const buffer = new Uint8Array(2);
    buffer[0] = 1;
    buffer[1] = index;
    return buffer;
  }
}
