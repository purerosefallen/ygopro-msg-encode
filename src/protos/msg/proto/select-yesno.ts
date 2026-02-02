import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';

export class YGOProMsgSelectYesNo extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_YESNO;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('i32', 1)
  desc: number;

  defaultResponse() {
    return this.prepareResponse(false);
  }

  prepareResponse(yes: boolean) {
    const buffer = new Uint8Array(4);
    const view = new DataView(buffer.buffer);
    view.setInt32(0, yes ? 1 : 0, true);
    return buffer;
  }
}
