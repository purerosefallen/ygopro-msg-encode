import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

export class YGOProStocTypeChange extends YGOProStocBase {
  static identifier = 0x13;

  @BinaryField('u8', 0)
  type: number;
}
