import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';
import { RequireQueryCardLocation } from '../query-location';

export class YGOProMsgSwap_CardLocation {
  @BinaryField('u8', 0)
  controller: number;

  @BinaryField('u8', 1)
  location: number;

  @BinaryField('u8', 2)
  sequence: number;

  @BinaryField('u8', 3)
  position: number;
}

export class YGOProMsgSwap extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SWAP;

  @BinaryField('i32', 0)
  code1: number;

  @BinaryField(() => YGOProMsgSwap_CardLocation, 4)
  card1: YGOProMsgSwap_CardLocation;

  @BinaryField('i32', 8)
  code2: number;

  @BinaryField(() => YGOProMsgSwap_CardLocation, 12)
  card2: YGOProMsgSwap_CardLocation;

  getRequireRefreshCards(): RequireQueryCardLocation[] {
    return [
      {
        player: this.card1.controller,
        location: this.card1.location,
        sequence: this.card1.sequence,
      },
      {
        player: this.card2.controller,
        location: this.card2.location,
        sequence: this.card2.sequence,
      },
    ];
  }
}
