import { BinaryField } from '../../../binary/binary-meta';
import { YGOProCtosBase } from '../base';

export class YGOProCtosTpResult extends YGOProCtosBase {
  static identifier = 0x4;

  @BinaryField('u8', 0)
  res: number;
}
