import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

export class YGOProStocHsPlayerChange extends YGOProStocBase {
  static identifier = 0x21;

  // pos<<4 | state
  @BinaryField('u8', 0)
  status: number;
}
