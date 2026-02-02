import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';
import {
  IndexResponse,
  IndexResponseObject,
  isIndexResponse,
} from '../index-response';

export enum IdleCmdType {
  SUMMON = 0,
  SPSUMMON = 1,
  REPOS = 2,
  MSET = 3,
  SSET = 4,
  ACTIVATE = 5,
  TO_BP = 6,
  TO_EP = 7,
  SHUFFLE = 8,
}

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

export class YGOProMsgSelectIdleCmd extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_IDLECMD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  summonableCount: number;

  @BinaryField(
    () => YGOProMsgSelectIdleCmd_SimpleCardInfo,
    2,
    (obj) => obj.summonableCount,
  )
  summonableCards: YGOProMsgSelectIdleCmd_SimpleCardInfo[];

  @BinaryField('u8', (obj) => 2 + obj.summonableCount * 7)
  spSummonableCount: number;

  @BinaryField(
    () => YGOProMsgSelectIdleCmd_SimpleCardInfo,
    (obj) => 3 + obj.summonableCount * 7,
    (obj) => obj.spSummonableCount,
  )
  spSummonableCards: YGOProMsgSelectIdleCmd_SimpleCardInfo[];

  @BinaryField(
    'u8',
    (obj) => 3 + obj.summonableCount * 7 + obj.spSummonableCount * 7,
  )
  reposableCount: number;

  @BinaryField(
    () => YGOProMsgSelectIdleCmd_SimpleCardInfo,
    (obj) => 4 + obj.summonableCount * 7 + obj.spSummonableCount * 7,
    (obj) => obj.reposableCount,
  )
  reposableCards: YGOProMsgSelectIdleCmd_SimpleCardInfo[];

  @BinaryField(
    'u8',
    (obj) =>
      4 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7,
  )
  msetableCount: number;

  @BinaryField(
    () => YGOProMsgSelectIdleCmd_SimpleCardInfo,
    (obj) =>
      5 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7,
    (obj) => obj.msetableCount,
  )
  msetableCards: YGOProMsgSelectIdleCmd_SimpleCardInfo[];

  @BinaryField(
    'u8',
    (obj) =>
      5 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7,
  )
  ssetableCount: number;

  @BinaryField(
    () => YGOProMsgSelectIdleCmd_SimpleCardInfo,
    (obj) =>
      6 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7,
    (obj) => obj.ssetableCount,
  )
  ssetableCards: YGOProMsgSelectIdleCmd_SimpleCardInfo[];

  @BinaryField(
    'u8',
    (obj) =>
      6 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7,
  )
  activatableCount: number;

  @BinaryField(
    () => YGOProMsgSelectIdleCmd_ActivatableInfo,
    (obj) =>
      7 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7,
    (obj) => obj.activatableCount,
  )
  activatableCards: YGOProMsgSelectIdleCmd_ActivatableInfo[];

  @BinaryField(
    'u8',
    (obj) =>
      7 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7 +
      obj.activatableCount * 11,
  )
  toBpCount: number;

  @BinaryField(
    () => YGOProMsgSelectIdleCmd_ActivatableInfo,
    (obj) =>
      8 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7 +
      obj.activatableCount * 11,
    (obj) => obj.toBpCount,
  )
  toBpCards: YGOProMsgSelectIdleCmd_ActivatableInfo[];

  @BinaryField(
    'u8',
    (obj) =>
      8 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7 +
      obj.activatableCount * 11 +
      obj.toBpCount * 11,
  )
  toEpCount: number;

  @BinaryField(
    () => YGOProMsgSelectIdleCmd_ActivatableInfo,
    (obj) =>
      9 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7 +
      obj.activatableCount * 11 +
      obj.toBpCount * 11,
    (obj) => obj.toEpCount,
  )
  toEpCards: YGOProMsgSelectIdleCmd_ActivatableInfo[];

  @BinaryField(
    'u8',
    (obj) =>
      9 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7 +
      obj.activatableCount * 11 +
      obj.toBpCount * 11 +
      obj.toEpCount * 11,
  )
  shuffleCount: number;

  @BinaryField(
    () => YGOProMsgSelectIdleCmd_ActivatableInfo,
    (obj) =>
      10 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7 +
      obj.activatableCount * 11 +
      obj.toBpCount * 11 +
      obj.toEpCount * 11,
    (obj) => obj.shuffleCount,
  )
  shuffleCards: YGOProMsgSelectIdleCmd_ActivatableInfo[];

  @BinaryField(
    'u8',
    (obj) =>
      10 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7 +
      obj.activatableCount * 11 +
      obj.toBpCount * 11 +
      obj.toEpCount * 11 +
      obj.shuffleCount * 11,
  )
  canBp: number;

  @BinaryField(
    'u8',
    (obj) =>
      11 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7 +
      obj.activatableCount * 11 +
      obj.toBpCount * 11 +
      obj.toEpCount * 11 +
      obj.shuffleCount * 11,
  )
  canEp: number;

  @BinaryField(
    'u8',
    (obj) =>
      12 +
      obj.summonableCount * 7 +
      obj.spSummonableCount * 7 +
      obj.reposableCount * 7 +
      obj.msetableCount * 7 +
      obj.ssetableCount * 7 +
      obj.activatableCount * 11 +
      obj.toBpCount * 11 +
      obj.toEpCount * 11 +
      obj.shuffleCount * 11,
  )
  canShuffle: number;

  prepareResponse(
    type: IdleCmdType,
    option?:
      | IndexResponseObject
      | {
          code?: number;
          controller?: number;
          location?: number;
          sequence?: number;
          desc?: number;
        },
  ) {
    let sequence: number;

    if (
      type === IdleCmdType.SUMMON ||
      type === IdleCmdType.SPSUMMON ||
      type === IdleCmdType.REPOS ||
      type === IdleCmdType.MSET ||
      type === IdleCmdType.SSET ||
      type === IdleCmdType.ACTIVATE
    ) {
      if (option == null) {
        throw new TypeError(`Option required for ${IdleCmdType[type]}`);
      }

      let cards: any[];
      let maxCount: number;
      let typeName: string;

      if (type === IdleCmdType.SUMMON) {
        cards = this.summonableCards;
        maxCount = this.summonableCount;
        typeName = 'Summonable';
      } else if (type === IdleCmdType.SPSUMMON) {
        cards = this.spSummonableCards;
        maxCount = this.spSummonableCount;
        typeName = 'Special summonable';
      } else if (type === IdleCmdType.REPOS) {
        cards = this.reposableCards;
        maxCount = this.reposableCount;
        typeName = 'Repositionable';
      } else if (type === IdleCmdType.MSET) {
        cards = this.msetableCards;
        maxCount = this.msetableCount;
        typeName = 'Monster settable';
      } else if (type === IdleCmdType.SSET) {
        cards = this.ssetableCards;
        maxCount = this.ssetableCount;
        typeName = 'Spell/Trap settable';
      } else {
        // IdleCmdType.ACTIVATE
        cards = this.activatableCards;
        maxCount = this.activatableCount;
        typeName = 'Activatable';
      }

      if (isIndexResponse(option)) {
        sequence = option.index;
        if (sequence < 0 || sequence >= maxCount) {
          throw new TypeError(`Index out of range: ${sequence}`);
        }
      } else {
        const idx = cards.findIndex(
          (card) =>
            (option.code == null || card.code === option.code) &&
            (option.controller == null ||
              card.controller === option.controller) &&
            (option.location == null || card.location === option.location) &&
            (option.sequence == null || card.sequence === option.sequence) &&
            (option.desc == null || card.desc === option.desc),
        );
        if (idx === -1) {
          throw new TypeError(`${typeName} card not found`);
        }
        sequence = idx;
      }
    } else if (type === IdleCmdType.TO_BP) {
      if (this.canBp === 0) {
        throw new TypeError('Cannot go to BP');
      }
      sequence = 0;
    } else if (type === IdleCmdType.TO_EP) {
      if (this.canEp === 0) {
        throw new TypeError('Cannot go to EP');
      }
      sequence = 0;
    } else if (type === IdleCmdType.SHUFFLE) {
      if (this.canShuffle === 0) {
        throw new TypeError('Cannot shuffle');
      }
      sequence = 0;
    } else {
      throw new TypeError(`Unknown type: ${type}`);
    }

    const buffer = new Uint8Array(4);
    const view = new DataView(buffer.buffer);
    view.setUint32(0, (sequence << 16) | type, true);
    return buffer;
  }
}
