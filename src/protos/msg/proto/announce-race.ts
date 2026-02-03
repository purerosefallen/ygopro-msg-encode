import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';

export class YGOProMsgAnnounceRace extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_ANNOUNCE_RACE;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('u32', 2)
  availableRaces: number;

  responsePlayer() {
    return this.player;
  }

  prepareResponse(races: number) {
    const buffer = new Uint8Array(4);
    const view = new DataView(buffer.buffer);
    view.setInt32(0, races, true);
    return buffer;
  }
}
