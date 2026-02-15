import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { NetPlayerType } from '../../network-enums';
import { YGOProMsgBase } from '../base';
import { RequireQueryCardLocation } from '../query-location';

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
    // gframe/tag_duel 对 MSG_MOVE 的遮蔽规则是：
    // 除当前控制方外，其他所有人（包含队友）都使用同一规则遮蔽 code。
    return this.opponentView();
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

  getRequireRefreshCards(): RequireQueryCardLocation[] {
    const current = this.current;
    const previous = this.previous;
    const shouldRefresh =
      current.location !== 0 &&
      (current.location & OcgcoreScriptConstants.LOCATION_OVERLAY) === 0 &&
      (current.location !== previous.location ||
        current.controller !== previous.controller);
    if (!shouldRefresh) {
      return [];
    }
    return [
      {
        player: current.controller,
        location: current.location,
        sequence: current.sequence,
      },
    ];
  }
}
