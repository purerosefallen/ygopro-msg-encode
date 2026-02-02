import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgChainDisabled extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CHAIN_DISABLED;

  @BinaryField('u8', 0)
  chainCount: number;
}
