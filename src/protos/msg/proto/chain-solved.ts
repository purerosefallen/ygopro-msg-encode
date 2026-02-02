import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgChainSolved extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CHAIN_SOLVED;

  @BinaryField('u8', 0)
  chainCount: number;
}
