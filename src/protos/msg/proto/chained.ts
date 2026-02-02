import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgChained extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CHAINED;

  @BinaryField('u8', 0)
  chainCount: number;
}
