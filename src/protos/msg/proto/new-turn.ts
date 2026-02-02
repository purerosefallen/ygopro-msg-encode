import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgNewTurn extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_NEW_TURN;

  @BinaryField('u8', 0)
  player: number;
}
