import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSet extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SET;

  @BinaryField('i32', 0)
  code: number;

  // MSG_SET 是盖放卡片，所有人都看不到 code（包括玩家自己）
  // 服务器在发送前会将 code 清零
  opponentView(): this {
    const view = this.copy();
    view.code = 0;
    return view;
  }

  teammateView(): this {
    const view = this.copy();
    view.code = 0;
    return view;
  }

  observerView(): this {
    const view = this.copy();
    view.code = 0;
    return view;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  playerView(playerId: number): this {
    // 盖放卡片，即使是玩家自己也看不到
    const view = this.copy();
    view.code = 0;
    return view;
  }
}
