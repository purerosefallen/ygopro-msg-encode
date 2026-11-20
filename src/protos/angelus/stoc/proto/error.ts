import { BinaryField } from '../../../../binary/binary-meta';
import { YGOProAngelusStocBase } from '../base';
import { YGOProAngelusErrorCode } from '../../enums';
import { checkInteger, utf8Decoder, utf8Encoder } from '../../wire';

export class YGOProAngelusError extends YGOProAngelusStocBase {
  static identifier = 0xff;

  @BinaryField('u16', 0)
  code = YGOProAngelusErrorCode.BadRequest;

  message = '';

  protected validateFields(): void {
    checkInteger(this.code, 1, 4, 'code');
  }

  protected readTail(tail: Uint8Array): void {
    this.message = utf8Decoder.decode(tail);
  }

  protected writeTail(): Uint8Array {
    return utf8Encoder.encode(this.message);
  }
}
