import { BinaryField } from '../../../binary/binary-meta';
import { YGOProCtosBase } from '../base';
import { NetPlayerType } from '../../network-enums';

export class YGOProCtosKick extends YGOProCtosBase {
  static identifier = 0x24;

  @BinaryField('u8', 0)
  pos: NetPlayerType;
}
