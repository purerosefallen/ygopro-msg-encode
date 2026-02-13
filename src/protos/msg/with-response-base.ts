import { YGOProMsgBase } from './base';

export class YGOProMsgResponseBase extends YGOProMsgBase {
  defaultResponse(): Uint8Array | undefined {
    return undefined;
  }

  responsePlayer(): number {
    return 0;
  }

  getSendTargets(): number[] {
    return [this.responsePlayer()];
  }
}
