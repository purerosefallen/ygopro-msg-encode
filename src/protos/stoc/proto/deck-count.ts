import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

// STOC_DECK_COUNT: int16_t[6]
export class YGOProStocDeckCount extends YGOProStocBase {
  static identifier = 0x9;

  @BinaryField('i16', 0, 6)
  counts: number[];
}
