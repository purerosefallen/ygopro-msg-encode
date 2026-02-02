import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectSum_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('i32', 7)
  opParam: number;
}

export class YGOProMsgSelectSum extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_SUM;

  @BinaryField('u8', 0)
  mode: number;

  @BinaryField('u8', 1)
  player: number;

  @BinaryField('i32', 2)
  sumVal: number;

  @BinaryField('u8', 6)
  min: number;

  @BinaryField('u8', 7)
  max: number;

  @BinaryField('u8', 8)
  mustSelectCount: number;

  @BinaryField(
    () => YGOProMsgSelectSum_CardInfo,
    9,
    (obj) => obj.mustSelectCount,
  )
  mustSelectCards: YGOProMsgSelectSum_CardInfo[];

  @BinaryField('u8', (obj) => {
    return 9 + obj.mustSelectCount * 11;
  })
  count: number;

  @BinaryField(
    () => YGOProMsgSelectSum_CardInfo,
    (obj) => {
      return 10 + obj.mustSelectCount * 11;
    },
    (obj) => obj.count,
  )
  cards: YGOProMsgSelectSum_CardInfo[];
}
