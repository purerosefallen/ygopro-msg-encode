import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSortCard_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;
}

export class YGOProMsgSortCard extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SORT_CARD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField(() => YGOProMsgSortCard_CardInfo, 2, (obj) => obj.count)
  cards: YGOProMsgSortCard_CardInfo[];
}
