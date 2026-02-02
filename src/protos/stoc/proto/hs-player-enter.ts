import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

export class YGOProStocHsPlayerEnter extends YGOProStocBase {
  static identifier = 0x20;

  @BinaryField('utf16', 0, 20)
  name: string;

  @BinaryField('u8', 40)
  pos: number;

  // 1 byte padding (note: actual size is 41 bytes, not 42 - workaround in original code)
}
