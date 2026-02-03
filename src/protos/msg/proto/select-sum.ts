import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';
import {
  IndexResponse,
  IndexResponseObject,
  isIndexResponse,
} from '../index-response';

export class YGOProMsgSelectSum_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('i32', 7)
  opParam: number;
}

export class YGOProMsgSelectSum extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_SUM;

  @BinaryField('u8', 0)
  mode: number;

  @BinaryField('u8', 1)
  player: number;

  @BinaryField('i32', 2)
  sumVal: number;

  @BinaryField('u8', 6)
  min: number;

  @BinaryField('u8', 7)
  max: number;

  @BinaryField('u8', 8)
  mustSelectCount: number;

  @BinaryField(
    () => YGOProMsgSelectSum_CardInfo,
    9,
    (obj) => obj.mustSelectCount,
  )
  mustSelectCards: YGOProMsgSelectSum_CardInfo[];

  @BinaryField('u8', (obj) => {
    return 9 + obj.mustSelectCount * 11;
  })
  count: number;

  @BinaryField(
    () => YGOProMsgSelectSum_CardInfo,
    (obj) => {
      return 10 + obj.mustSelectCount * 11;
    },
    (obj) => obj.count,
  )
  cards: YGOProMsgSelectSum_CardInfo[];

  responsePlayer() {
    return this.player;
  }

  prepareResponse(
    cardOptions: Array<
      | IndexResponseObject
      | {
          code?: number;
          controller?: number;
          location?: number;
          sequence?: number;
        }
    >,
  ) {
    const indices: number[] = [];
    for (const option of cardOptions) {
      let index: number;
      if (isIndexResponse(option)) {
        index = option.index;
        if (index < 0 || index >= this.count) {
          throw new TypeError(`Index out of range: ${index}`);
        }
      } else {
        index = this.cards.findIndex(
          (card) =>
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
    }

    const buffer = new Uint8Array(1 + indices.length);
    buffer[0] = this.mustSelectCount + indices.length;
    indices.forEach((idx, i) => {
      buffer[1 + i] = idx;
    });
    return buffer;
  }
}
