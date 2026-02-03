import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';
import {
  IndexResponse,
  IndexResponseObject,
  isIndexResponse,
} from '../index-response';

export class YGOProMsgSelectCounter_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('u16', 7)
  counterCount: number;
}

export class YGOProMsgSelectCounter extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_COUNTER;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u16', 1)
  counterType: number;

  @BinaryField('u16', 3)
  counterCount: number;

  @BinaryField('u8', 5)
  count: number;

  @BinaryField(() => YGOProMsgSelectCounter_CardInfo, 6, (obj) => obj.count)
  cards: YGOProMsgSelectCounter_CardInfo[];

  responsePlayer() {
    return this.player;
  }

  prepareResponse(
    counterOptions: Array<{
      card:
        | IndexResponseObject
        | {
            code?: number;
            controller?: number;
            location?: number;
            sequence?: number;
          };
      count: number;
    }>,
  ) {
    // 创建一个数组，初始化为0
    const counterCounts = new Array(this.count).fill(0);

    for (const option of counterOptions) {
      let index: number;
      if (isIndexResponse(option.card)) {
        index = option.card.index;
        if (index < 0 || index >= this.count) {
          throw new TypeError(`Index out of range: ${index}`);
        }
      } else {
        const card = option.card as {
          code?: number;
          controller?: number;
          location?: number;
          sequence?: number;
        };
        index = this.cards.findIndex(
          (card) =>
            (card.code == null || card.code === card.code) &&
            (card.controller == null || card.controller === card.controller) &&
            (card.location == null || card.location === card.location) &&
            (card.sequence == null || card.sequence === card.sequence),
        );
        if (index === -1) {
          throw new TypeError('Card not found');
        }
      }
      counterCounts[index] = option.count;
    }

    const buffer = new Uint8Array(counterCounts.length * 2);
    const view = new DataView(buffer.buffer);
    counterCounts.forEach((count, i) => {
      view.setUint16(i * 2, count, true);
    });
    return buffer;
  }
}
