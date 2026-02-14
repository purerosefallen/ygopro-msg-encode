import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgTagSwap extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_TAG_SWAP;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  mzoneCount: number;

  @BinaryField('u8', 2)
  extraCount: number;

  @BinaryField('u8', 3)
  pzoneCount: number;

  @BinaryField('u8', 4)
  handCount: number;

  @BinaryField('i32', 5, (obj) => obj.handCount)
  handCards: number[];

  @BinaryField('i32', (obj) => 5 + obj.handCount * 4, (obj) => obj.extraCount)
  extraCards: number[];

  @BinaryField('u32', (obj) => 5 + obj.handCount * 4 + obj.extraCount * 4)
  mzoneFlags: number;

  // 对方和队友视角需要隐藏手牌和额外卡组信息
  opponentView(): this {
    const view = this.copy();
    // 根据 tag_duel.cpp，手牌和额外卡组都只遮掩非公开的（没有 0x80000000 标记的）
    view.handCards = view.handCards.map((card) => {
      if (!(card & 0x80000000)) {
        return 0;
      }
      return card;
    });
    view.extraCards = view.extraCards.map((card) => {
      if (!(card & 0x80000000)) {
        return 0;
      }
      return card;
    });
    return view;
  }

  teammateView(): this {
    return this.opponentView();
  }

  getRequireRefreshZones() {
    const location =
      OcgcoreScriptConstants.LOCATION_MZONE |
      OcgcoreScriptConstants.LOCATION_SZONE |
      OcgcoreScriptConstants.LOCATION_HAND;
    return [
      { player: 0, location },
      { player: 1, location },
    ];
  }
}
