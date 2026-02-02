import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSwapGraveDeck extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SWAP_GRAVE_DECK;

  @BinaryField('u8', 0)
  player: number;
}
