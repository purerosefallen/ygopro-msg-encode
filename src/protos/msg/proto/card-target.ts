import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgCardTarget_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;
}

export class YGOProMsgCardTarget extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CARD_TARGET;

  @BinaryField(() => YGOProMsgCardTarget_CardLocation, 0)
  card1: YGOProMsgCardTarget_CardLocation;

  @BinaryField(() => YGOProMsgCardTarget_CardLocation, 3)
  card2: YGOProMsgCardTarget_CardLocation;
}
