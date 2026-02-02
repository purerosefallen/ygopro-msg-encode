import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgChaining extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CHAINING;

  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('u8', 7)
  subsequence: number;

  @BinaryField('u8', 8)
  chainCount: number;

  @BinaryField('i32', 9)
  desc: number;

  @BinaryField('u8', 13)
  chainPlayer: number;
}
