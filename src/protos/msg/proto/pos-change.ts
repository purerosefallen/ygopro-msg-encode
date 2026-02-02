import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgPosChange_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;
}

export class YGOProMsgPosChange extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_POS_CHANGE;

  @BinaryField(() => YGOProMsgPosChange_CardLocation, 0)
  card: YGOProMsgPosChange_CardLocation;

  @BinaryField('u8', 3)
  previousPosition: number;

  @BinaryField('u8', 4)
  currentPosition: number;
}
