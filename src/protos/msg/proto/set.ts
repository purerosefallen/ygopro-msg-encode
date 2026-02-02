import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSet extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SET;

  @BinaryField('i32', 0)
  code: number;
}
