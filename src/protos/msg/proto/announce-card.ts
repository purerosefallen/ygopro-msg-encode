import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgAnnounceCard extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_ANNOUNCE_CARD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('i32', 2, (obj) => obj.count)
  cards: number[];
}
