import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgTossDice extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_TOSS_DICE;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('u8', 2, (obj) => obj.count)
  results: number[];
}
