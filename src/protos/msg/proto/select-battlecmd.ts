import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';
import {
  IndexResponse,
  IndexResponseObject,
  isIndexResponse,
} from '../index-response';

export enum BattleCmdType {
  ACTIVATE = 0,
  ATTACK = 1,
  TO_M2 = 2,
  TO_EP = 3,
}

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

export class YGOProMsgSelectBattleCmd extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_BATTLECMD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  activatableCount: number;

  @BinaryField(
    () => YGOProMsgSelectBattleCmd_ActivatableInfo,
    2,
    (obj) => obj.activatableCount,
  )
  activatableCards: YGOProMsgSelectBattleCmd_ActivatableInfo[];

  @BinaryField('u8', (obj) => {
    return 2 + obj.activatableCount * 11;
  })
  attackableCount: number;

  @BinaryField(
    () => YGOProMsgSelectBattleCmd_AttackableInfo,
    (obj) => {
      return 3 + obj.activatableCount * 11;
    },
    (obj) => obj.attackableCount,
  )
  attackableCards: YGOProMsgSelectBattleCmd_AttackableInfo[];

  @BinaryField('u8', (obj) => {
    return 3 + obj.activatableCount * 11 + obj.attackableCount * 8;
  })
  canM2: number;

  @BinaryField('u8', (obj) => {
    return 4 + obj.activatableCount * 11 + obj.attackableCount * 8;
  })
  canEp: number;

  responsePlayer() {
    return this.player;
  }

  prepareResponse(
    type: BattleCmdType,
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

    if (type === BattleCmdType.ACTIVATE) {
      if (option == null) {
        throw new TypeError('Option required for ACTIVATE');
      }
      if (isIndexResponse(option)) {
        sequence = option.index;
        if (sequence < 0 || sequence >= this.activatableCount) {
          throw new TypeError(`Index out of range: ${sequence}`);
        }
      } else {
        const idx = this.activatableCards.findIndex(
          (card) =>
            (option.code == null || card.code === option.code) &&
            (option.controller == null ||
              card.controller === option.controller) &&
            (option.location == null || card.location === option.location) &&
            (option.sequence == null || card.sequence === option.sequence) &&
            (option.desc == null || card.desc === option.desc),
        );
        if (idx === -1) {
          throw new TypeError('Activatable card not found');
        }
        sequence = idx;
      }
    } else if (type === BattleCmdType.ATTACK) {
      if (option == null) {
        throw new TypeError('Option required for ATTACK');
      }
      if (isIndexResponse(option)) {
        sequence = option.index;
        if (sequence < 0 || sequence >= this.attackableCount) {
          throw new TypeError(`Index out of range: ${sequence}`);
        }
      } else {
        const idx = this.attackableCards.findIndex(
          (card) =>
            (option.code == null || card.code === option.code) &&
            (option.controller == null ||
              card.controller === option.controller) &&
            (option.location == null || card.location === option.location) &&
            (option.sequence == null || card.sequence === option.sequence),
        );
        if (idx === -1) {
          throw new TypeError('Attackable card not found');
        }
        sequence = idx;
      }
    } else if (type === BattleCmdType.TO_M2) {
      if (this.canM2 === 0) {
        throw new TypeError('Cannot go to M2');
      }
      sequence = 0;
    } else if (type === BattleCmdType.TO_EP) {
      if (this.canEp === 0) {
        throw new TypeError('Cannot go to EP');
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
