import { BinaryField } from '../../../../binary/binary-meta';
import { YGOProMessages } from '../../../msg/registry';
import { YGOProMsgBase } from '../../../msg/base';
import { YGOProMsgResponseBase } from '../../../msg/with-response-base';
import {
  YGOProMsgRetry,
  YGOProMsgUpdateCard,
  YGOProMsgUpdateData,
  YGOProMsgWin,
} from '../../../msg/proto';
import { YGOProAngelusStocBase } from '../base';
import { YGOProAngelusProcessStatus as Status } from '../../enums';
import { checkInteger, viewOf } from '../../wire';

function readMessage(bytes: Uint8Array, framed: boolean) {
  const Message = YGOProMessages.get(bytes[0]);
  if (!Message) throw new Error(`Unknown MSG identifier: ${bytes[0]}`);
  // UPDATE_DATA is constructed by the server. Its card list extends to the
  // enclosing packet boundary; it cannot delimit itself in a native batch.
  if (!framed && Message === YGOProMsgUpdateData) {
    throw new Error('MSG_UPDATE_DATA requires an explicit message boundary');
  }
  const message = new Message().fromPayload(bytes);
  // UPDATE_CARD carries the native query chunk length, including padding.
  let length: number;
  if (message instanceof YGOProMsgUpdateCard) {
    length = 4 + viewOf(bytes).getInt32(4, true);
  } else if (message instanceof YGOProMsgUpdateData) {
    length = bytes.length;
  } else {
    length = message.toPayload().length;
  }
  checkInteger(length, 1, Math.min(bytes.length, 0xffff), 'MSG length');
  if (framed && length !== bytes.length) throw new Error('MSG length mismatch');
  return { message, length };
}

function controlStatus(message: YGOProMsgBase): Status {
  if (message instanceof YGOProMsgWin) return Status.Win;
  if (message instanceof YGOProMsgRetry) return Status.Retry;
  if (message instanceof YGOProMsgResponseBase) return Status.AwaitResponse;
  return Status.Continue;
}

export class YGOProAngelusProcessResult extends YGOProAngelusStocBase {
  static identifier = 0x82;

  @BinaryField('u8', 0)
  status = Status.Continue;
  messages: Uint8Array[] = [];

  protected validateFields(): void {
    checkInteger(this.status, 0, 3, 'process result status');
  }

  protected readTail(tail: Uint8Array): void {
    const messages: Uint8Array[] = [];
    const view = viewOf(tail);
    for (let offset = 0; offset < tail.length; ) {
      const length = view.getUint16(offset, true);
      offset += 2;
      if (!length || offset + length > tail.length)
        throw new Error('Invalid framed MSG length');
      messages.push(tail.subarray(offset, offset + length));
      offset += length;
    }
    this.messages = messages;
  }

  protected writeTail(): Uint8Array {
    let size = 0;
    for (const bytes of this.messages) {
      checkInteger(bytes.length, 1, 0xffff, 'MSG length');
      size += 2 + bytes.length;
    }
    const tail = new Uint8Array(size);
    const view = viewOf(tail);
    let offset = 0;
    for (const bytes of this.messages) {
      view.setUint16(offset, bytes.length, true);
      tail.set(bytes, offset + 2);
      offset += 2 + bytes.length;
    }
    return tail;
  }

  decodeMessages(): YGOProMsgBase[] {
    return this.messages.map((bytes) => readMessage(bytes, true).message);
  }

  fromOcgcorePayload(raw: Uint8Array): this {
    const messages: Uint8Array[] = [];
    let status = Status.Continue;
    for (let offset = 0; offset < raw.length; ) {
      const { message, length } = readMessage(raw.subarray(offset), false);
      messages.push(raw.subarray(offset, offset + length));
      if (status === Status.Continue) status = controlStatus(message);
      offset += length;
    }
    this.messages = messages;
    this.status = status;
    return this;
  }
}
