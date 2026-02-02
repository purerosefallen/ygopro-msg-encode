import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

// STOC_CREATE_GAME is reserved
export class YGOProStocCreateGame extends YGOProStocBase {
  static identifier = 0x11;

  @BinaryField('u32', 0)
  gameid: number;
}
