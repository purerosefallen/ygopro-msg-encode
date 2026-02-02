import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgDraw extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_DRAW;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('i32', 2, (obj) => obj.count)
  cards: number[];

  // 对方视角需要隐藏抽到的卡（如果卡片标志位 0x80 未设置）
  opponentView(): this {
    const view = this.copy();
    view.cards = view.cards.map((card) => {
      // 如果卡片的高位（0x80000000）未设置，对方看不到，返回 0
      if (!(card & 0x80000000)) {
        return 0;
      }
      return card;
    });
    return view;
  }
}
