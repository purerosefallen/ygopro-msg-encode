import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgResetTime extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_RESET_TIME;

  @BinaryField('i8', 0)
  player: number;

  @BinaryField('i16', 1)
  time: number;

  getSendTargets(): number[] {
    return [];
  }
}
