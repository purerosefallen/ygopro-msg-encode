import { BinaryField } from '../../../binary/binary-meta';
import { HostInfo } from '../../common';
import { YGOProCtosBase } from '../base';

export class YGOProCtosCreateGame extends YGOProCtosBase {
  static identifier = 0x11;

  @BinaryField(() => HostInfo, 0)
  info: HostInfo;

  @BinaryField('utf16', 20, 20)
  name: string;

  @BinaryField('utf16', 60, 20)
  pass: string;
}
