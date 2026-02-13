import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgDamageStepEnd extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_DAMAGE_STEP_END;

  getRequireRefreshZones() {
    return [
      { player: 0, location: OcgcoreScriptConstants.LOCATION_MZONE },
      { player: 1, location: OcgcoreScriptConstants.LOCATION_MZONE },
    ];
  }
}
