import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import {
  decodePublicRevealPosition,
  encodePublicRevealPosition,
  sanitizePublicRevealPositionForView,
  shouldHideFacedownCode,
} from '../../common/public-reveal-position';
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

  reveal?: boolean;

  fromPayload(data: Uint8Array): this {
    super.fromPayload(data);
    decodePublicRevealPosition(this);
    return this;
  }

  toPayload(): Uint8Array {
    const payload = this.copy();
    payload.position = encodePublicRevealPosition(
      payload.position,
      payload.reveal,
    );
    delete payload.reveal;
    return YGOProMsgBase.prototype.toPayload.call(payload);
  }

  private viewCopy(): this {
    const view = this.copy();
    sanitizePublicRevealPositionForView(view);
    return view;
  }

  opponentView(): this {
    const view = this.viewCopy();
    // 如果是背面特召 (POS_FACEDOWN)，隐藏 code
    if (shouldHideFacedownCode(this.position, this.reveal)) {
      view.code = 0;
    }
    return view;
  }

  teammateView(): this {
    // TAG 决斗中，己方队友可以看到完整信息（包括背面特召的卡）
    return this.viewCopy();
  }

  playerView(playerId: number): this {
    if (playerId === NetPlayerType.OBSERVER) {
      return this.observerView();
    }
    if (playerId === this.controller) {
      return this.viewCopy();
    }
    return this.opponentView();
  }
}
