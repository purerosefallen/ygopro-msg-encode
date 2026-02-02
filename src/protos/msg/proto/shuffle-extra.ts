import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgShuffleExtra extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SHUFFLE_EXTRA;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('i32', 2, (obj) => obj.count)
  cards: number[];

  // 对方视角需要隐藏额外卡组信息
  opponentView(): this {
    const view = this.copy();
    view.cards = view.cards.map((card) => {
      if (!(card & 0x80000000)) {
        return 0;
      }
      return card;
    });
    return view;
  }
}
