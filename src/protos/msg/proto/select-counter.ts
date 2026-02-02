import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectCounter_CardInfo {
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

  @BinaryField('u16', 8)
  counterCount: number;
}

export class YGOProMsgSelectCounter extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_COUNTER;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u16', 1)
  counterType: number;

  @BinaryField('u16', 3)
  counterCount: number;

  @BinaryField('u8', 5)
  count: number;

  @BinaryField(() => YGOProMsgSelectCounter_CardInfo, 6, (obj) => obj.count)
  cards: YGOProMsgSelectCounter_CardInfo[];
}
