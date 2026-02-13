import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgDamageStepStart extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_DAMAGE_STEP_START;

  getRequireRefreshZones() {
    return [
      { player: 0, location: OcgcoreScriptConstants.LOCATION_MZONE },
      { player: 1, location: OcgcoreScriptConstants.LOCATION_MZONE },
    ];
  }
}
