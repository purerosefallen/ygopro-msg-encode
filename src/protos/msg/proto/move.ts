import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgMove extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_MOVE;

  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  previousController: number;

  @BinaryField('u8', 5)
  previousLocation: number;

  @BinaryField('u8', 6)
  previousSequence: number;

  @BinaryField('u8', 7)
  previousPosition: number;

  @BinaryField('u8', 8)
  currentController: number;

  @BinaryField('u8', 9)
  currentLocation: number;

  @BinaryField('u8', 10)
  currentSequence: number;

  @BinaryField('u8', 11)
  currentPosition: number;

  @BinaryField('i32', 12)
  reason: number;
}
