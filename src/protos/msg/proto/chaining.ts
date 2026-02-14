import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgChaining_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;
}

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

  @BinaryField(() => YGOProMsgChaining_CardLocation, 8)
  chainCardLocation: YGOProMsgChaining_CardLocation;

  @BinaryField('i32', 11)
  desc: number;

  @BinaryField('u8', 15)
  chainCount: number;
}
