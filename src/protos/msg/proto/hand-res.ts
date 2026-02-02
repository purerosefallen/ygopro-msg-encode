import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgHandRes extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_HAND_RES;

  @BinaryField('u8', 0)
  result: number;
}
