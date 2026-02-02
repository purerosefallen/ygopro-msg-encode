import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';

export class YGOProMsgAnnounceCard extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_ANNOUNCE_CARD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('i32', 2, (obj) => obj.count)
  cards: number[];

  prepareResponse(cardCode: number) {
    const buffer = new Uint8Array(4);
    const view = new DataView(buffer.buffer);
    view.setInt32(0, cardCode, true);
    return buffer;
  }
}
