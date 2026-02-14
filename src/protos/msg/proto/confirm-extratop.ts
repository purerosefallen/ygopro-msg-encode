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

  // MSG_CONFIRM_EXTRATOP 在 single_duel.cpp 中不做遮掩，直接发给所有人
  // ocgcore 通过 0x80000000 标记控制公开状态
  // 因此使用基类的默认实现（不遮掩）
}
