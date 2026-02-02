import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgRemoveCounter extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_REMOVE_COUNTER;

  @BinaryField('u16', 0)
  counterType: number;

  @BinaryField('u8', 2)
  controller: number;

  @BinaryField('u8', 3)
  location: number;

  @BinaryField('u8', 4)
  sequence: number;

  @BinaryField('u16', 5)
  count: number;
}
