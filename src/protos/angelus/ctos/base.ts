import { YGOProAngelusBase } from '../base';

export class YGOProAngelusCtosBase extends YGOProAngelusBase {
  static readonly messageDirection = 'CTOS';

  get messageDirection() {
    return YGOProAngelusCtosBase.messageDirection;
  }
}
