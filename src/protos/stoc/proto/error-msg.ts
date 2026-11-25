import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';
import { ErrorMessageType } from '../../network-enums';

export class YGOProStocErrorMsg extends YGOProStocBase {
  static identifier = 0x2;

  @BinaryField('u8', 0, undefined, { enum: ErrorMessageType })
  msg: ErrorMessageType;

  // 3 bytes padding

  @BinaryField('u32', 4)
  code: number;
}
