import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgChainEnd extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CHAIN_END;

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
