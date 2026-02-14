import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgBattle_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;

  @BinaryField('u8', 3)
  position: number;
}

export class YGOProMsgBattle_CardStats {
  @BinaryField(() => YGOProMsgBattle_CardLocation, 0)
  location: YGOProMsgBattle_CardLocation;

  @BinaryField('i32', 4)
  atk: number;

  @BinaryField('i32', 8)
  def: number;
}

export class YGOProMsgBattle extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_BATTLE;

  @BinaryField(() => YGOProMsgBattle_CardStats, 0)
  attacker: YGOProMsgBattle_CardStats;

  @BinaryField('u8', 12)
  attackerBattleState: number;

  @BinaryField(() => YGOProMsgBattle_CardStats, 13)
  defender: YGOProMsgBattle_CardStats;

  @BinaryField('u8', 25)
  defenderBattleState: number;
}
