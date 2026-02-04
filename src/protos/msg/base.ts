import { PayloadBase } from '../../proto-base/payload-base';
import { NetPlayerType } from '../network-enums';

// 常用的发送目标常量
export const SEND_TO_PLAYERS: number[] = [0, 1];
export const SEND_TO_ALL: number[] = [0, 1, NetPlayerType.OBSERVER];

export class YGOProMsgBase extends PayloadBase {
  fromPayload(data: Uint8Array): this {
    if (data.length < 1) {
      throw new Error('MSG data too short');
    }
    const msgType = data[0];
    if (msgType !== this.identifier) {
      throw new Error(
        `MSG type mismatch: expected ${this.identifier}, got ${msgType}`,
      );
    }
    // 从第二个字节开始解析
    return super.fromPayload(data.slice(1));
  }

  toPayload(): Uint8Array {
    const payload = super.toPayload();
    const result = new Uint8Array(1 + payload.length);
    result[0] = this.identifier;
    result.set(payload, 1);
    return result;
  }

  opponentView(): this {
    return this.copy();
  }

  teammateView(): this {
    return this.copy();
  }

  observerView(): this {
    return this.opponentView();
  }

  playerView(playerId: number): this {
    if (typeof this['player'] === 'number') {
      const selfPlayerId = this['player'];
      if (selfPlayerId === playerId) {
        return this.copy();
      }
      return this.opponentView();
    }
    return this.copy();
  }

  getSendTargets(): number[] {
    return SEND_TO_ALL;
  }
}
