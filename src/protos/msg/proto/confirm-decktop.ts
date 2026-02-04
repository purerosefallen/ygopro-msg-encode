import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgConfirmDeckTop_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;
}

export class YGOProMsgConfirmDeckTop extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CONFIRM_DECKTOP;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField(() => YGOProMsgConfirmDeckTop_CardInfo, 2, (obj) => obj.count)
  cards: YGOProMsgConfirmDeckTop_CardInfo[];

  // 对方视角可能需要隐藏卡片信息
  opponentView(): this {
    const view = this.copy();
    view.cards = view.cards.map((card) => {
      const c = { ...card };
      if (!(c.code & 0x80000000)) {
        c.code = 0;
      }
      return c;
    });
    return view;
  }

  // confirm-decktop 使用基类的 playerView (基于 player 字段)
}
