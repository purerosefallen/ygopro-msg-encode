import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';
import { RequireQueryCardLocation } from '../query-location';

export class YGOProMsgFlipSummoning extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_FLIPSUMMONING;

  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('u8', 7)
  position: number;

  getRequireRefreshCards(): RequireQueryCardLocation[] {
    return [
      {
        player: this.controller,
        location: this.location,
        sequence: this.sequence,
      },
    ];
  }
}
