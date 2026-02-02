import { BinaryField } from '../../../binary/binary-meta';
import { YGOProCtosBase } from '../base';

export class YGOProCtosJoinGame extends YGOProCtosBase {
  static identifier = 0x12;

  @BinaryField('u16', 0)
  version: number;

  // 2 bytes padding

  @BinaryField('u32', 4)
  gameid: number;

  @BinaryField('utf16', 8, 20)
  pass: string;
}
