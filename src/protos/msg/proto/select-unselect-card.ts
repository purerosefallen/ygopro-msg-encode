import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectUnselectCard_CardInfo {
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

export class YGOProMsgSelectUnselectCard extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_UNSELECT_CARD;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  finishable: number;

  @BinaryField('u8', 2)
  cancelable: number;

  @BinaryField('u8', 3)
  min: number;

  @BinaryField('u8', 4)
  max: number;

  @BinaryField('u8', 5)
  selectableCount: number;

  @BinaryField(
    () => YGOProMsgSelectUnselectCard_CardInfo,
    6,
    (obj) => obj.selectableCount,
  )
  selectableCards: YGOProMsgSelectUnselectCard_CardInfo[];

  @BinaryField('u8', (obj) => {
    return 6 + obj.selectableCount * 8;
  })
  unselectableCount: number;

  @BinaryField(
    () => YGOProMsgSelectUnselectCard_CardInfo,
    (obj) => {
      return 7 + obj.selectableCount * 8;
    },
    (obj) => obj.unselectableCount,
  )
  unselectableCards: YGOProMsgSelectUnselectCard_CardInfo[];
}
