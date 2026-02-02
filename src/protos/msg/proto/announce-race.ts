import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgAnnounceRace extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_ANNOUNCE_RACE;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u32', 1)
  availableRaces: number;

  @BinaryField('u8', 5)
  count: number;
}
