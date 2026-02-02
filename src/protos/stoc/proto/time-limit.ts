import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

export class YGOProStocTimeLimit extends YGOProStocBase {
  static identifier = 0x18;

  @BinaryField('u8', 0)
  player: number;

  // 1 byte padding

  @BinaryField('u16', 2)
  left_time: number;
}
