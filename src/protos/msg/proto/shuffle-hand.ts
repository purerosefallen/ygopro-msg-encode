import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgShuffleHand extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SHUFFLE_HAND;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('i32', 2, (obj) => obj.count)
  cards: number[];

  // 对方视角需要隐藏手牌信息
  opponentView(): this {
    const view = this.copy();
    view.cards = view.cards.map(() => 0);
    return view;
  }

  teammateView(): this {
    return this.opponentView();
  }

  getRequireRefreshZones() {
    return [
      {
        player: this.player,
        location: OcgcoreScriptConstants.LOCATION_HAND,
      },
    ];
  }
}
