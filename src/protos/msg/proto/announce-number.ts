import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';
import {
  IndexResponse,
  IndexResponseObject,
  isIndexResponse,
} from '../index-response';

export class YGOProMsgAnnounceNumber extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_ANNOUNCE_NUMBER;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('i32', 2, (obj) => obj.count)
  numbers: number[];

  prepareResponse(option: IndexResponseObject | number) {
    let index: number;

    if (isIndexResponse(option)) {
      index = option.index;
      if (index < 0 || index >= this.count) {
        throw new TypeError(`Index out of range: ${index}`);
      }
    } else {
      index = this.numbers.indexOf(option);
      if (index === -1) {
        throw new TypeError(`Number not found: ${option}`);
      }
    }

    const buffer = new Uint8Array(4);
    const view = new DataView(buffer.buffer);
    view.setInt32(0, index, true);
    return buffer;
  }
}
