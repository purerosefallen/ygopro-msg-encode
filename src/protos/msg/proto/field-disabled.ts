import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgFieldDisabled extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_FIELD_DISABLED;

  @BinaryField('u32', 0)
  disabledField: number;
}
