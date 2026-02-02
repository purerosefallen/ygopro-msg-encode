import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgShuffleDeck extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SHUFFLE_DECK;

  @BinaryField('u8', 0)
  player: number;
}
