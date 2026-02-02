import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
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
    view.handCards = view.handCards.map(() => 0);
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
}
