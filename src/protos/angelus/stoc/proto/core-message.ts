import { BinaryField } from '../../../../binary/binary-meta';
import { YGOProAngelusStocBase } from '../base';
import { YGOProAngelusCoreMessageType } from '../../enums';
import { checkInteger, utf8Decoder, utf8Encoder } from '../../wire';

export class YGOProAngelusCoreMessage extends YGOProAngelusStocBase {
  static identifier = 0x90;

  @BinaryField('u8', 0)
  type = YGOProAngelusCoreMessageType.DebugMessage;

  message = '';

  protected checkRequestId(id: number): void {
    checkInteger(id, 0, 0, 'CORE_MESSAGE requestId');
  }

  protected validateFields(): void {
    checkInteger(this.type, 0, 1, 'type');
  }

  protected readTail(tail: Uint8Array): void {
    this.message = utf8Decoder.decode(tail);
  }

  protected writeTail(): Uint8Array {
    return utf8Encoder.encode(this.message);
  }
}
