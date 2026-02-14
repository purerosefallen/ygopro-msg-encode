import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSet extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SET;

  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('u8', 7)
  position: number;

  // MSG_SET 的 code 在常见网络转发路径会被置 0
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
