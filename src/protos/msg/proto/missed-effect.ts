import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgMissedEffect extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_MISSED_EFFECT;

  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;

  @BinaryField('u8', 3)
  position: number;

  @BinaryField('i32', 4)
  code: number;

  getSendTargets(): number[] {
    // single_duel.cpp: player = pbuf[0], then only send to players[player].
    // pbuf[0] is the low byte of get_info_location(), i.e. controller.
    return [this.controller];
  }
}
