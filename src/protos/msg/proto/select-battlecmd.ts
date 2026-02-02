import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectBattleCmd_ActivatableInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('i32', 7)
  desc: number;
}

export class YGOProMsgSelectBattleCmd_AttackableInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('u8', 7)
  directAttack: number;
}

export class YGOProMsgSelectBattleCmd extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_BATTLECMD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  activatableCount: number;

  @BinaryField(() => YGOProMsgSelectBattleCmd_ActivatableInfo, 2, (obj) => obj.activatableCount)
  activatableCards: YGOProMsgSelectBattleCmd_ActivatableInfo[];

  @BinaryField('u8', (obj) => {
    return 2 + obj.activatableCount * 11;
  })
  attackableCount: number;

  @BinaryField(() => YGOProMsgSelectBattleCmd_AttackableInfo, (obj) => {
    return 3 + obj.activatableCount * 11;
  }, (obj) => obj.attackableCount)
  attackableCards: YGOProMsgSelectBattleCmd_AttackableInfo[];

  @BinaryField('u8', (obj) => {
    return 3 + obj.activatableCount * 11 + obj.attackableCount * 8;
  })
  canM2: number;

  @BinaryField('u8', (obj) => {
    return 4 + obj.activatableCount * 11 + obj.attackableCount * 8;
  })
  canEp: number;
}
