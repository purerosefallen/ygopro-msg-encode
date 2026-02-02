import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectCard_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('u8', 7)
  subsequence: number;
}

export class YGOProMsgSelectCard extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_CARD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  cancelable: number;

  @BinaryField('u8', 2)
  min: number;

  @BinaryField('u8', 3)
  max: number;

  @BinaryField('u8', 4)
  count: number;

  @BinaryField(() => YGOProMsgSelectCard_CardInfo, 5, (obj) => obj.count)
  cards: YGOProMsgSelectCard_CardInfo[];
}
