import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgAttack_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;

  @BinaryField('u8', 3)
  position: number;
}

export class YGOProMsgAttack extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_ATTACK;

  @BinaryField(() => YGOProMsgAttack_CardLocation, 0)
  attacker: YGOProMsgAttack_CardLocation;

  @BinaryField(() => YGOProMsgAttack_CardLocation, 4)
  defender: YGOProMsgAttack_CardLocation;
}
