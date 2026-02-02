import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgCancelTarget_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;
}

export class YGOProMsgCancelTarget extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CANCEL_TARGET;

  @BinaryField(() => YGOProMsgCancelTarget_CardLocation, 0)
  card1: YGOProMsgCancelTarget_CardLocation;

  @BinaryField(() => YGOProMsgCancelTarget_CardLocation, 3)
  card2: YGOProMsgCancelTarget_CardLocation;
}
