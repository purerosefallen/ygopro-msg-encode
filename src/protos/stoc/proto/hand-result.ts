import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

export class YGOProStocHandResult extends YGOProStocBase {
  static identifier = 0x5;

  @BinaryField('u8', 0)
  res1: number;

  @BinaryField('u8', 1)
  res2: number;
}
