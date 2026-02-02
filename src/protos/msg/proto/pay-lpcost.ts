import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgPayLpCost extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_PAY_LPCOST;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('i32', 1)
  cost: number;
}
