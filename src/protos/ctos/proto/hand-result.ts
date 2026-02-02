import { BinaryField } from '../../../binary/binary-meta';
import { YGOProCtosBase } from '../base';
import { HandResult } from '../../network-enums';

export class YGOProCtosHandResult extends YGOProCtosBase {
  static identifier = 0x3;

  @BinaryField('u8', 0)
  res: HandResult;
}
