import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgDeckTop extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_DECK_TOP;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  sequence: number;

  @BinaryField('i32', 2)
  code: number;

  // 对方视角可能需要隐藏卡片信息
  opponentView(): this {
    const view = this.copy();
    if (!(view.code & 0x80000000)) {
      view.code = 0;
    }
    return view;
  }
}
