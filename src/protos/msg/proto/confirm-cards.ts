import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { SEND_TO_ALL, YGOProMsgBase } from '../base';

export class YGOProMsgConfirmCards_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('u8', 7)
  subsequence: number;
}

export class YGOProMsgConfirmCards extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CONFIRM_CARDS;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  unused: number;

  @BinaryField('u8', 2)
  count: number;

  @BinaryField(() => YGOProMsgConfirmCards_CardInfo, 3, (obj) => obj.count)
  cards: YGOProMsgConfirmCards_CardInfo[];

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

  getSendTargets(): number[] {
    // 如果卡片在 DECK 位置，只发给 player
    if (this.cards.length > 0 && this.cards[0].location === 0x01) { // LOCATION_DECK
      return [this.player];
    }
    // 否则发给所有人
    return SEND_TO_ALL;
  }
}
