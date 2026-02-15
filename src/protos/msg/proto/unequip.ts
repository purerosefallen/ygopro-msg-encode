import { BinaryField } from '../../../binary/binary-meta';
import { YGOProMsgBase } from '../base';

export class YGOProMsgUnequip_CardLocation {
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

export class YGOProMsgUnequip extends YGOProMsgBase {
  static identifier = 95; // MSG_UNEQUIP

  @BinaryField(() => YGOProMsgUnequip_CardLocation, 0)
  card: YGOProMsgUnequip_CardLocation;
}
