import { YGOProMsgBase } from './base';

export abstract class YGOProMsgResponseBase extends YGOProMsgBase {
  defaultResponse(): Uint8Array | undefined {
    return undefined;
  }

  abstract responsePlayer(): number;
}
