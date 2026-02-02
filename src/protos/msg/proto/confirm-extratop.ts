import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgConfirmExtraTop_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;
}

export class YGOProMsgConfirmExtraTop extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CONFIRM_EXTRATOP;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField(() => YGOProMsgConfirmExtraTop_CardInfo, 2, (obj) => obj.count)
  cards: YGOProMsgConfirmExtraTop_CardInfo[];

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
}
