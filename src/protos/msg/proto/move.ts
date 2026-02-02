import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgMove_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;

  @BinaryField('u8', 3)
  position: number;
}

export class YGOProMsgMove extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_MOVE;

  @BinaryField('i32', 0)
  code: number;

  @BinaryField(() => YGOProMsgMove_CardLocation, 4)
  previous: YGOProMsgMove_CardLocation;

  @BinaryField(() => YGOProMsgMove_CardLocation, 8)
  current: YGOProMsgMove_CardLocation;

  @BinaryField('i32', 12)
  reason: number;
}
