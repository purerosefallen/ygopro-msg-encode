import { BinaryField } from '../../../binary/binary-meta';
import { YGOProCtosBase } from '../base';

export class YGOProCtosPlayerInfo extends YGOProCtosBase {
  static identifier = 0x10;

  @BinaryField('utf16', 0, 20)
  name: string;
}
