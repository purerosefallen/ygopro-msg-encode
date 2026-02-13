import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgNewPhase extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_NEW_PHASE;

  @BinaryField('u16', 0)
  phase: number;

  getRequireRefreshZones() {
    const location =
      OcgcoreScriptConstants.LOCATION_MZONE |
      OcgcoreScriptConstants.LOCATION_SZONE |
      OcgcoreScriptConstants.LOCATION_HAND;
    return [
      { player: 0, location },
      { player: 1, location },
    ];
  }
}
