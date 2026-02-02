import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgLpUpdate extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_LPUPDATE;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('i32', 1)
  lp: number;
}
