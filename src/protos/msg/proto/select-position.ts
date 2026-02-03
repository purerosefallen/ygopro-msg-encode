import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';

export class YGOProMsgSelectPosition extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_POSITION;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('i32', 1)
  code: number;

  @BinaryField('u8', 5)
  positions: number;

  responsePlayer() {
    return this.player;
  }

  prepareResponse(position: number) {
    const buffer = new Uint8Array(4);
    const view = new DataView(buffer.buffer);
    view.setInt32(0, position, true);
    return buffer;
  }
}
