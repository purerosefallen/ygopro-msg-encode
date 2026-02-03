import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';

export class YGOProMsgSelectPlace extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_PLACE;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('u32', 2)
  flag: number;

  responsePlayer() {
    return this.player;
  }

  prepareResponse(
    places: Array<{ player: number; location: number; sequence: number }>,
  ) {
    const buffer = new Uint8Array(places.length * 3);
    places.forEach((place, i) => {
      buffer[i * 3] = place.player;
      buffer[i * 3 + 1] = place.location;
      buffer[i * 3 + 2] = place.sequence;
    });
    return buffer;
  }
}
