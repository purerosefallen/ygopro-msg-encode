import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { NetPlayerType } from '../../network-enums';
import { YGOProMsgBase } from '../base';

export class YGOProMsgMove_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;

  @BinaryField('u8', 3)
  position: number;
}

export class YGOProMsgMove extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_MOVE;

  @BinaryField('i32', 0)
  code: number;

  @BinaryField(() => YGOProMsgMove_CardLocation, 4)
  previous: YGOProMsgMove_CardLocation;

  @BinaryField(() => YGOProMsgMove_CardLocation, 8)
  current: YGOProMsgMove_CardLocation;

  @BinaryField('i32', 12)
  reason: number;

  opponentView(): this {
    const view = this.copy();
    const cl = view.current.location;
    const cp = view.current.position;

    // 移动到墓地或叠放不隐藏
    if (
      cl &
      (OcgcoreScriptConstants.LOCATION_GRAVE |
        OcgcoreScriptConstants.LOCATION_OVERLAY)
    ) {
      return view;
    }

    // 移动到卡组、手牌或背面位置时隐藏 code
    if (
      cl &
        (OcgcoreScriptConstants.LOCATION_DECK |
          OcgcoreScriptConstants.LOCATION_HAND) ||
      cp & OcgcoreCommonConstants.POS_FACEDOWN
    ) {
      view.code = 0;
    }

    return view;
  }

  teammateView(): this {
    // TAG 决斗中，队友能看到场上的背面卡，但看不到手牌和卡组
    const view = this.copy();
    const cl = view.current.location;
    const cp = view.current.position;

    // 移动到墓地或叠放不隐藏
    if (
      cl &
      (OcgcoreScriptConstants.LOCATION_GRAVE |
        OcgcoreScriptConstants.LOCATION_OVERLAY)
    ) {
      return view;
    }

    // 移动到卡组、手牌时隐藏 code
    if (
      cl &
      (OcgcoreScriptConstants.LOCATION_DECK |
        OcgcoreScriptConstants.LOCATION_HAND)
    ) {
      view.code = 0;
    }

    // 场上的背面卡队友可以看到
    return view;
  }

  playerView(playerId: number): this {
    if (playerId === NetPlayerType.OBSERVER) {
      return this.observerView();
    }
    if (playerId === this.current.controller) {
      return this.copy();
    }
    return this.opponentView();
  }
}
