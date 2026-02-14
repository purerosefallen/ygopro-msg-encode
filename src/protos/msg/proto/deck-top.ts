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

  // MSG_DECK_TOP 在 single_duel.cpp 中不做遮掩，直接发给所有人
  // ocgcore 通过 0x80000000 标记控制公开状态
  // 因此使用基类的默认实现（不遮掩）
}
