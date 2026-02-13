import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSummoned extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SUMMONED;

  getRequireRefreshZones() {
    const location =
      OcgcoreScriptConstants.LOCATION_MZONE |
      OcgcoreScriptConstants.LOCATION_SZONE;
    return [
      { player: 0, location },
      { player: 1, location },
    ];
  }
}
