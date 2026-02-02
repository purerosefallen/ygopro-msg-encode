import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectEffectYn extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_EFFECTYN;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('i32', 1)
  code: number;

  @BinaryField('u8', 5)
  controller: number;

  @BinaryField('u8', 6)
  location: number;

  @BinaryField('u8', 7)
  sequence: number;

  @BinaryField('u8', 8)
  position: number;

  @BinaryField('i32', 9)
  desc: number;
}
