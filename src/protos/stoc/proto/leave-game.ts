import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

// STOC_LEAVE_GAME is reserved
export class YGOProStocLeaveGame extends YGOProStocBase {
  static identifier = 0x14;

  @BinaryField('u8', 0)
  pos: number;
}
