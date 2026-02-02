import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgPlayerHint extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_PLAYER_HINT;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  type: number;

  @BinaryField('i32', 2)
  value: number;
}
