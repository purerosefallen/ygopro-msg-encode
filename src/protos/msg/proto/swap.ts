import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSwap_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;

  @BinaryField('u8', 3)
  position: number;
}

export class YGOProMsgSwap extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SWAP;

  @BinaryField(() => YGOProMsgSwap_CardLocation, 0)
  card1: YGOProMsgSwap_CardLocation;

  @BinaryField(() => YGOProMsgSwap_CardLocation, 4)
  card2: YGOProMsgSwap_CardLocation;
}
