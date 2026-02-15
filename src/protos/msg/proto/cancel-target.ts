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

  // get_info_location() 的第 4 字节（gframe 侧会读取后丢弃）
  @BinaryField('u8', 3)
  position: number;
}

export class YGOProMsgCancelTarget extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CANCEL_TARGET;

  @BinaryField(() => YGOProMsgCancelTarget_CardLocation, 0)
  card1: YGOProMsgCancelTarget_CardLocation;

  @BinaryField(() => YGOProMsgCancelTarget_CardLocation, 4)
  card2: YGOProMsgCancelTarget_CardLocation;
}
