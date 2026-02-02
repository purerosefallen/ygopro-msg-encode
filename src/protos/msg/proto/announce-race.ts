import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';

export class YGOProMsgAnnounceRace extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_ANNOUNCE_RACE;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u32', 1)
  availableRaces: number;

  @BinaryField('u8', 5)
  count: number;

  prepareResponse(races: number) {
    const buffer = new Uint8Array(4);
    const view = new DataView(buffer.buffer);
    view.setInt32(0, races, true);
    return buffer;
  }
}
