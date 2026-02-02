import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgEquip extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_EQUIP;

  @BinaryField('u8', 0)
  equipController: number;

  @BinaryField('u8', 1)
  equipLocation: number;

  @BinaryField('u8', 2)
  equipSequence: number;

  @BinaryField('u8', 3)
  targetController: number;

  @BinaryField('u8', 4)
  targetLocation: number;

  @BinaryField('u8', 5)
  targetSequence: number;

  @BinaryField('u8', 6)
  position: number;
}
