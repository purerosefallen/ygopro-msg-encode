import { YGOProAngelusBase } from '../base';

export class YGOProAngelusStocBase extends YGOProAngelusBase {
  static readonly messageDirection = 'STOC';

  get messageDirection() {
    return YGOProAngelusStocBase.messageDirection;
  }
}
