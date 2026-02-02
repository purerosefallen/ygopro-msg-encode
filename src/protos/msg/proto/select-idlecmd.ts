import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectIdleCmd_SimpleCardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;
}

export class YGOProMsgSelectIdleCmd_ActivatableInfo {
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

export class YGOProMsgSelectIdleCmd extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_IDLECMD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  summonableCount: number;

  @BinaryField(() => YGOProMsgSelectIdleCmd_SimpleCardInfo, 2, (obj) => obj.summonableCount)
  summonableCards: YGOProMsgSelectIdleCmd_SimpleCardInfo[];

  @BinaryField('u8', (obj) => 2 + obj.summonableCount * 7)
  spSummonableCount: number;

  @BinaryField(() => YGOProMsgSelectIdleCmd_SimpleCardInfo, (obj) => 3 + obj.summonableCount * 7, (obj) => obj.spSummonableCount)
  spSummonableCards: YGOProMsgSelectIdleCmd_SimpleCardInfo[];

  @BinaryField('u8', (obj) => 3 + obj.summonableCount * 7 + obj.spSummonableCount * 7)
  reposableCount: number;

  @BinaryField(() => YGOProMsgSelectIdleCmd_SimpleCardInfo, (obj) => 4 + obj.summonableCount * 7 + obj.spSummonableCount * 7, (obj) => obj.reposableCount)
  reposableCards: YGOProMsgSelectIdleCmd_SimpleCardInfo[];

  @BinaryField('u8', (obj) => 4 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7)
  msetableCount: number;

  @BinaryField(() => YGOProMsgSelectIdleCmd_SimpleCardInfo, (obj) => 5 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7, (obj) => obj.msetableCount)
  msetableCards: YGOProMsgSelectIdleCmd_SimpleCardInfo[];

  @BinaryField('u8', (obj) => 5 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7)
  activatableCount: number;

  @BinaryField(() => YGOProMsgSelectIdleCmd_ActivatableInfo, (obj) => 6 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7, (obj) => obj.activatableCount)
  activatableCards: YGOProMsgSelectIdleCmd_ActivatableInfo[];

  @BinaryField('u8', (obj) => 6 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7 + obj.activatableCount * 11)
  toBpCount: number;

  @BinaryField(() => YGOProMsgSelectIdleCmd_ActivatableInfo, (obj) => 7 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7 + obj.activatableCount * 11, (obj) => obj.toBpCount)
  toBpCards: YGOProMsgSelectIdleCmd_ActivatableInfo[];

  @BinaryField('u8', (obj) => 7 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7 + obj.activatableCount * 11 + obj.toBpCount * 11)
  toEpCount: number;

  @BinaryField(() => YGOProMsgSelectIdleCmd_ActivatableInfo, (obj) => 8 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7 + obj.activatableCount * 11 + obj.toBpCount * 11, (obj) => obj.toEpCount)
  toEpCards: YGOProMsgSelectIdleCmd_ActivatableInfo[];

  @BinaryField('u8', (obj) => 8 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7 + obj.activatableCount * 11 + obj.toBpCount * 11 + obj.toEpCount * 11)
  shuffleCount: number;

  @BinaryField(() => YGOProMsgSelectIdleCmd_ActivatableInfo, (obj) => 9 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7 + obj.activatableCount * 11 + obj.toBpCount * 11 + obj.toEpCount * 11, (obj) => obj.shuffleCount)
  shuffleCards: YGOProMsgSelectIdleCmd_ActivatableInfo[];

  @BinaryField('u8', (obj) => 9 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7 + obj.activatableCount * 11 + obj.toBpCount * 11 + obj.toEpCount * 11 + obj.shuffleCount * 11)
  canBp: number;

  @BinaryField('u8', (obj) => 10 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7 + obj.activatableCount * 11 + obj.toBpCount * 11 + obj.toEpCount * 11 + obj.shuffleCount * 11)
  canEp: number;

  @BinaryField('u8', (obj) => 11 + obj.summonableCount * 7 + obj.spSummonableCount * 7 + obj.reposableCount * 7 + obj.msetableCount * 7 + obj.activatableCount * 11 + obj.toBpCount * 11 + obj.toEpCount * 11 + obj.shuffleCount * 11)
  canShuffle: number;
}
