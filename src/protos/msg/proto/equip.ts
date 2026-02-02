import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgEquip_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;
}

export class YGOProMsgEquip extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_EQUIP;

  @BinaryField(() => YGOProMsgEquip_CardLocation, 0)
  equip: YGOProMsgEquip_CardLocation;

  @BinaryField(() => YGOProMsgEquip_CardLocation, 3)
  target: YGOProMsgEquip_CardLocation;

  @BinaryField('u8', 6)
  position: number;
}
