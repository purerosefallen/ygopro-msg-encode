import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';
import {
  IndexResponse,
  IndexResponseObject,
  isIndexResponse,
} from '../index-response';

export class YGOProMsgSortCard_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;
}

export class YGOProMsgSortCard extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SORT_CARD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField(() => YGOProMsgSortCard_CardInfo, 2, (obj) => obj.count)
  cards: YGOProMsgSortCard_CardInfo[];

  defaultResponse() {
    return this.prepareResponse(null);
  }

  prepareResponse(
    sortedOptions?: Array<
      | IndexResponseObject
      | {
          code?: number;
          controller?: number;
          location?: number;
          sequence?: number;
        }
    > | null,
  ) {
    if (sortedOptions == null) {
      return new Uint8Array([0xff]);
    }

    const indices: number[] = [];
    for (const option of sortedOptions) {
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

    const buffer = new Uint8Array(indices.length);
    indices.forEach((idx, i) => {
      buffer[i] = idx;
    });
    return buffer;
  }
}
