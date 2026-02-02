import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectPlace extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_PLACE;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('u32', 2)
  flag: number;
}
