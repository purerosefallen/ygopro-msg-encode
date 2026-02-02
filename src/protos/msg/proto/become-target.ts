import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgBecomeTarget extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_BECOME_TARGET;

  @BinaryField('u8', 0)
  count: number;

  @BinaryField('i32', 1, (obj) => obj.count)
  targets: number[];
}
