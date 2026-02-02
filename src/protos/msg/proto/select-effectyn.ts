import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgResponseBase } from '../with-response-base';

export class YGOProMsgSelectEffectYn extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_EFFECTYN;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('i32', 1)
  code: number;

  @BinaryField('u8', 5)
  controller: number;

  @BinaryField('u8', 6)
  location: number;

  @BinaryField('u8', 7)
  sequence: number;

  @BinaryField('u8', 8)
  position: number;

  @BinaryField('i32', 9)
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
