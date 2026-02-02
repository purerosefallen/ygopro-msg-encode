import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgWin extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_WIN;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  type: number;
}
