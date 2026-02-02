import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgHint extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_HINT;

  @BinaryField('u8', 0)
  type: number;

  @BinaryField('u8', 1)
  player: number;

  @BinaryField('i32', 2)
  desc: number;
}
