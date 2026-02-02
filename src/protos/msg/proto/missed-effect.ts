import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgMissedEffect extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_MISSED_EFFECT;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('i32', 1)
  code: number;

  @BinaryField('i32', 5)
  desc: number;
}
