import { PayloadBase } from '../../proto-base/payload-base';

export class YGOProMsgBase extends PayloadBase {
  opponentView(): this {
    return this.copy();
  }

  teammateView(): this {
    return this.copy();
  }

  playerView(playerId: number): this {
    if (typeof this['playerId'] === 'number') {
      const selfPlayerId = this['playerId'];
      if (selfPlayerId === playerId) {
        return this.copy();
      }
      return this.opponentView();
    }
    return this.copy();
  }
}
