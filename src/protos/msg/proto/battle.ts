import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgBattle extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_BATTLE;

  @BinaryField('u8', 0)
  attackerController: number;

  @BinaryField('u8', 1)
  attackerLocation: number;

  @BinaryField('u8', 2)
  attackerSequence: number;

  @BinaryField('u8', 3)
  attackerPosition: number;

  @BinaryField('i32', 4)
  attackerAtk: number;

  @BinaryField('i32', 8)
  attackerDef: number;

  @BinaryField('u8', 12)
  defenderController: number;

  @BinaryField('u8', 13)
  defenderLocation: number;

  @BinaryField('u8', 14)
  defenderSequence: number;

  @BinaryField('u8', 15)
  defenderPosition: number;

  @BinaryField('i32', 16)
  defenderAtk: number;

  @BinaryField('i32', 20)
  defenderDef: number;

  @BinaryField('u8', 24)
  battleDamageCalc: number;
}
