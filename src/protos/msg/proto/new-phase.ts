import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgNewPhase extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_NEW_PHASE;

  @BinaryField('u16', 0)
  phase: number;
}
