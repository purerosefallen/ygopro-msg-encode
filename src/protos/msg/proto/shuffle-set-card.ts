import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgShuffleSetCard_SetCardInfo {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;

  @BinaryField('u8', 3)
  position: number;

  @BinaryField('u8', 4)
  newController: number;

  @BinaryField('u8', 5)
  newLocation: number;

  @BinaryField('u8', 6)
  newSequence: number;

  @BinaryField('u8', 7)
  newPosition: number;
}

export class YGOProMsgShuffleSetCard extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SHUFFLE_SET_CARD;

  @BinaryField('u8', 0)
  location: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField(() => YGOProMsgShuffleSetCard_SetCardInfo, 2, (obj) => obj.count)
  cards: YGOProMsgShuffleSetCard_SetCardInfo[];
}
