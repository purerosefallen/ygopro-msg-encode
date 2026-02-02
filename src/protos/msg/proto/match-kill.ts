import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgMatchKill extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_MATCH_KILL;

  @BinaryField('i32', 0)
  code: number;
}
