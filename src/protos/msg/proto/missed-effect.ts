import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgMissedEffect extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_MISSED_EFFECT;

  /**
   * ocgcore (ygopro-core) sends:
   *   - uint32: handler card info_location (controller/location/sequence/position packed)
   *   - uint32: handler card code
   *
   * See ygopro-core/processor.cpp::field::break_effect()
   */
  @BinaryField('u32', 0)
  location: number;

  @BinaryField('u32', 4)
  code: number;

  getSendTargets(): number[] {
    // Core does not include a target player byte; this is a broadcast stoc message.
    return [0, 1];
  }
}
