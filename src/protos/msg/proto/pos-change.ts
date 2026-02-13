import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';
import { RequireQueryCardLocation } from '../query-location';

export class YGOProMsgPosChange_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;
}

export class YGOProMsgPosChange extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_POS_CHANGE;

  @BinaryField(() => YGOProMsgPosChange_CardLocation, 0)
  card: YGOProMsgPosChange_CardLocation;

  @BinaryField('u8', 3)
  previousPosition: number;

  @BinaryField('u8', 4)
  currentPosition: number;

  getRequireRefreshCards(): RequireQueryCardLocation[] {
    const shouldRefresh =
      (this.previousPosition & OcgcoreCommonConstants.POS_FACEDOWN) !== 0 &&
      (this.currentPosition & OcgcoreCommonConstants.POS_FACEUP) !== 0;
    if (!shouldRefresh) {
      return [];
    }
    return [
      {
        player: this.card.controller,
        location: this.card.location,
        sequence: this.card.sequence,
      },
    ];
  }
}
