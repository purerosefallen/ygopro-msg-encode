import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

export class YGOProStocHsWatchChange extends YGOProStocBase {
  static identifier = 0x22;

  @BinaryField('u16', 0)
  watch_count: number;
}
