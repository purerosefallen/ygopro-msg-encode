import { YGOProMsgBase } from '../base';

// MSG_RELOAD_FIELD 的结构非常复杂，包含完整的场地信息
// 需要手动处理，因为它包含可变长度的数据和复杂的嵌套结构
export class YGOProMsgReloadField_ZoneCard {
  occupied: number;
  position?: number;
  xyzCount?: number;
}

export class YGOProMsgReloadField_PlayerInfo {
  lp: number;
  mzone: YGOProMsgReloadField_ZoneCard[];
  szone: YGOProMsgReloadField_ZoneCard[];
  deckCount: number;
  handCount: number;
  graveCount: number;
  removedCount: number;
  extraCount: number;
  extraPCount: number;
}

export class YGOProMsgReloadField_ChainInfo {
  code: number;
  chainCardController: number;
  chainCardLocation: number;
  chainCardSequence: number;
  chainCardSubsequence: number;
  triggerController: number;
  triggerLocation: number;
  triggerSequence: number;
  desc: number;
}

export class YGOProMsgReloadField extends YGOProMsgBase {
  static identifier = 162; // MSG_RELOAD_FIELD

  duelRule: number;
  players: YGOProMsgReloadField_PlayerInfo[];
  chains: YGOProMsgReloadField_ChainInfo[];

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

    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    let offset = 1;

    this.duelRule = view.getUint8(offset++);
    this.players = [];

    // 读取两个玩家的数据
    for (let i = 0; i < 2; i++) {
      const player: YGOProMsgReloadField_PlayerInfo = {
        lp: view.getInt32(offset, true),
        mzone: [],
        szone: [],
        deckCount: 0,
        handCount: 0,
        graveCount: 0,
        removedCount: 0,
        extraCount: 0,
        extraPCount: 0,
      };
      offset += 4;

      // 读取 mzone[7]
      for (let seq = 0; seq < 7; seq++) {
        const occupied = view.getUint8(offset++);
        const card: YGOProMsgReloadField_ZoneCard = { occupied };
        if (occupied) {
          card.position = view.getUint8(offset++);
          card.xyzCount = view.getUint8(offset++);
        }
        player.mzone.push(card);
      }

      // 读取 szone[8]
      for (let seq = 0; seq < 8; seq++) {
        const occupied = view.getUint8(offset++);
        const card: YGOProMsgReloadField_ZoneCard = { occupied };
        if (occupied) {
          card.position = view.getUint8(offset++);
        }
        player.szone.push(card);
      }

      // 读取各区域计数
      player.deckCount = view.getUint8(offset++);
      player.handCount = view.getUint8(offset++);
      player.graveCount = view.getUint8(offset++);
      player.removedCount = view.getUint8(offset++);
      player.extraCount = view.getUint8(offset++);
      player.extraPCount = view.getUint8(offset++);

      this.players.push(player);
    }

    // 读取连锁信息
    const chainCount = view.getUint8(offset++);
    this.chains = [];
    for (let i = 0; i < chainCount; i++) {
      const chain: YGOProMsgReloadField_ChainInfo = {
        code: view.getInt32(offset, true),
        chainCardController: view.getUint8(offset + 4),
        chainCardLocation: view.getUint8(offset + 5),
        chainCardSequence: view.getUint8(offset + 6),
        chainCardSubsequence: view.getUint8(offset + 7),
        triggerController: view.getUint8(offset + 8),
        triggerLocation: view.getUint8(offset + 9),
        triggerSequence: view.getUint8(offset + 10),
        desc: view.getInt32(offset + 11, true),
      };
      offset += 15;
      this.chains.push(chain);
    }

    return this;
  }

  toPayload(): Uint8Array {
    // 计算总大小
    let size = 1 + 1; // identifier + duelRule

    for (const player of this.players) {
      size += 4; // lp
      for (const card of player.mzone) {
        size += 1; // occupied
        if (card.occupied) {
          size += 2; // position + xyzCount
        }
      }
      for (const card of player.szone) {
        size += 1; // occupied
        if (card.occupied) {
          size += 1; // position
        }
      }
      size += 6; // deckCount, handCount, graveCount, removedCount, extraCount, extraPCount
    }

    size += 1; // chainCount
    size += this.chains.length * 15; // 每个连锁 15 字节

    const result = new Uint8Array(size);
    const view = new DataView(result.buffer);
    let offset = 0;

    result[offset++] = this.identifier;
    result[offset++] = this.duelRule;

    // 写入玩家数据
    for (const player of this.players) {
      view.setInt32(offset, player.lp, true);
      offset += 4;

      // 写入 mzone
      for (const card of player.mzone) {
        result[offset++] = card.occupied;
        if (card.occupied) {
          result[offset++] = card.position || 0;
          result[offset++] = card.xyzCount || 0;
        }
      }

      // 写入 szone
      for (const card of player.szone) {
        result[offset++] = card.occupied;
        if (card.occupied) {
          result[offset++] = card.position || 0;
        }
      }

      // 写入各区域计数
      result[offset++] = player.deckCount;
      result[offset++] = player.handCount;
      result[offset++] = player.graveCount;
      result[offset++] = player.removedCount;
      result[offset++] = player.extraCount;
      result[offset++] = player.extraPCount;
    }

    // 写入连锁信息
    result[offset++] = this.chains.length;
    for (const chain of this.chains) {
      view.setInt32(offset, chain.code, true);
      result[offset + 4] = chain.chainCardController;
      result[offset + 5] = chain.chainCardLocation;
      result[offset + 6] = chain.chainCardSequence;
      result[offset + 7] = chain.chainCardSubsequence;
      result[offset + 8] = chain.triggerController;
      result[offset + 9] = chain.triggerLocation;
      result[offset + 10] = chain.triggerSequence;
      view.setInt32(offset + 11, chain.desc, true);
      offset += 15;
    }

    return result;
  }
}
