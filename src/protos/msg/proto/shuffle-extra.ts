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
    // 根据 single_duel.cpp，对手视角下应该全部遮掩
    view.cards = view.cards.map(() => 0);
    return view;
  }
}
