import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectPosition extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_POSITION;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('i32', 1)
  code: number;

  @BinaryField('u8', 5)
  positions: number;
}
