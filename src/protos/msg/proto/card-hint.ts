import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgCardHint extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CARD_HINT;

  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;

  @BinaryField('u8', 3)
  subsequence: number;

  @BinaryField('u8', 4)
  type: number;

  @BinaryField('i32', 5)
  value: number;
}
