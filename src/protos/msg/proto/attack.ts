import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgAttack extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_ATTACK;

  @BinaryField('u8', 0)
  attackerController: number;

  @BinaryField('u8', 1)
  attackerLocation: number;

  @BinaryField('u8', 2)
  attackerSequence: number;

  @BinaryField('u8', 3)
  attackerPosition: number;

  @BinaryField('u8', 4)
  defenderController: number;

  @BinaryField('u8', 5)
  defenderLocation: number;

  @BinaryField('u8', 6)
  defenderSequence: number;

  @BinaryField('u8', 7)
  defenderPosition: number;
}
