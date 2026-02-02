import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

export class YGOProStocErrorMsg extends YGOProStocBase {
  static identifier = 0x2;

  @BinaryField('u8', 0)
  msg: number;

  // 3 bytes padding

  @BinaryField('u32', 4)
  code: number;
}
