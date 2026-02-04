import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { NetPlayerType } from '../../network-enums';
import { SEND_TO_ALL, YGOProMsgBase } from '../base';

// MSG_HINT 类型：只发给 player
const HINT_TYPES_SEND_TO_SELF = new Set([1, 2, 3, 5]);

// MSG_HINT 类型：发给对手和观战者
const HINT_TYPES_SEND_TO_OPPONENT = new Set([4, 6, 7, 8, 9, 11]);

export class YGOProMsgHint extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_HINT;

  @BinaryField('u8', 0)
  type: number;

  @BinaryField('u8', 1)
  player: number;

  @BinaryField('i32', 2)
  desc: number;

  getSendTargets(): number[] {
    if (HINT_TYPES_SEND_TO_SELF.has(this.type)) {
      return [this.player];
    }
    if (HINT_TYPES_SEND_TO_OPPONENT.has(this.type)) {
      return [1 - this.player, NetPlayerType.OBSERVER];
    }
    // case 10, 21, 22, 23, 24: send to all
    return SEND_TO_ALL;
  }
}
