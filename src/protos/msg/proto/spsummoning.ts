import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { NetPlayerType } from '../../network-enums';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSpSummoning extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SPSUMMONING;

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

  opponentView(): this {
    const view = this.copy();
    // 如果是背面特召 (POS_FACEDOWN)，隐藏 code
    if (view.position & OcgcoreCommonConstants.POS_FACEDOWN) {
      view.code = 0;
    }
    return view;
  }

  teammateView(): this {
    // TAG 决斗中，己方队友可以看到完整信息（包括背面特召的卡）
    return this.copy();
  }

  playerView(playerId: number): this {
    if (playerId === NetPlayerType.OBSERVER) {
      return this.observerView();
    }
    if (playerId === this.controller) {
      return this.copy();
    }
    return this.opponentView();
  }
}
