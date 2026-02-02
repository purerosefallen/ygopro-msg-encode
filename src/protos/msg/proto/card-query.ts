import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';

export class CardQuery_CardLocation {
  controller: number;
  location: number;
  sequence: number;
}

export class CardQuery_Counter {
  type: number;
  count: number;
}

export class CardQuery {
  flags: number = 0;
  empty?: boolean;

  // QUERY_CODE (1)
  code?: number;

  // QUERY_POSITION (2)
  position?: number;

  // QUERY_ALIAS (4)
  alias?: number;

  // QUERY_TYPE (8)
  type?: number;

  // QUERY_LEVEL (16)
  level?: number;

  // QUERY_RANK (32)
  rank?: number;

  // QUERY_ATTRIBUTE (64)
  attribute?: number;

  // QUERY_RACE (128)
  race?: number;

  // QUERY_ATTACK (256)
  attack?: number;

  // QUERY_DEFENSE (512)
  defense?: number;

  // QUERY_BASE_ATTACK (1024)
  baseAttack?: number;

  // QUERY_BASE_DEFENSE (2048)
  baseDefense?: number;

  // QUERY_REASON (4096)
  reason?: number;

  // QUERY_EQUIP_CARD (16384)
  equipCard?: CardQuery_CardLocation;

  // QUERY_TARGET_CARD (32768)
  targetCards?: CardQuery_CardLocation[];

  // QUERY_OVERLAY_CARD (65536)
  overlayCards?: number[];

  // QUERY_COUNTERS (131072)
  counters?: CardQuery_Counter[];

  // QUERY_OWNER (262144)
  owner?: number;

  // QUERY_STATUS (524288)
  status?: number;

  // QUERY_LSCALE (2097152)
  lscale?: number;

  // QUERY_RSCALE (4194304)
  rscale?: number;

  // QUERY_LINK (8388608)
  link?: number;
  linkMarker?: number;

  fromPayload(data: Uint8Array): this {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    let offset = 0;

    // 读取 flags
    this.flags = view.getInt32(offset, true) >>> 0;
    offset += 4;

    if (this.flags === 0) {
      this.empty = true;
      return this;
    }

    this.empty = false;

    // 按顺序检查每个查询标志
    if (this.flags & OcgcoreCommonConstants.QUERY_CODE) {
      this.code = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_POSITION) {
      const pdata = view.getInt32(offset, true);
      this.position = ((pdata >>> 24) & 0xff) >>> 0;
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_ALIAS) {
      this.alias = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_TYPE) {
      this.type = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_LEVEL) {
      this.level = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_RANK) {
      this.rank = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_ATTRIBUTE) {
      this.attribute = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_RACE) {
      this.race = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_ATTACK) {
      this.attack = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_DEFENSE) {
      this.defense = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_BASE_ATTACK) {
      this.baseAttack = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_BASE_DEFENSE) {
      this.baseDefense = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_REASON) {
      this.reason = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_REASON_CARD) {
      // 跳过 4 字节
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_EQUIP_CARD) {
      this.equipCard = {
        controller: view.getUint8(offset),
        location: view.getUint8(offset + 1),
        sequence: view.getUint8(offset + 2),
      };
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_TARGET_CARD) {
      const count = view.getInt32(offset, true);
      offset += 4;
      this.targetCards = [];
      for (let i = 0; i < count; i++) {
        this.targetCards.push({
          controller: view.getUint8(offset),
          location: view.getUint8(offset + 1),
          sequence: view.getUint8(offset + 2),
        });
        offset += 4;
      }
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_OVERLAY_CARD) {
      const count = view.getInt32(offset, true);
      offset += 4;
      this.overlayCards = [];
      for (let i = 0; i < count; i++) {
        this.overlayCards.push(view.getInt32(offset, true));
        offset += 4;
      }
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_COUNTERS) {
      const count = view.getInt32(offset, true);
      offset += 4;
      this.counters = [];
      for (let i = 0; i < count; i++) {
        this.counters.push({
          type: view.getUint16(offset, true),
          count: view.getUint16(offset + 2, true),
        });
        offset += 4;
      }
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_OWNER) {
      this.owner = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_STATUS) {
      this.status = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_LSCALE) {
      this.lscale = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_RSCALE) {
      this.rscale = view.getInt32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_LINK) {
      this.link = view.getInt32(offset, true);
      offset += 4;
      this.linkMarker = view.getInt32(offset, true);
      offset += 4;
    }

    return this;
  }

  toPayload(): Uint8Array {
    // 计算总大小
    let size = 4; // flags

    const flags = this.flags;

    if (flags & OcgcoreCommonConstants.QUERY_CODE) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_POSITION) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_ALIAS) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_TYPE) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_LEVEL) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_RANK) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_ATTRIBUTE) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_RACE) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_ATTACK) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_DEFENSE) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_BASE_ATTACK) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_BASE_DEFENSE) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_REASON) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_REASON_CARD) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_EQUIP_CARD) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_TARGET_CARD) {
      size += 4 + (this.targetCards?.length || 0) * 4;
    }
    if (flags & OcgcoreCommonConstants.QUERY_OVERLAY_CARD) {
      size += 4 + (this.overlayCards?.length || 0) * 4;
    }
    if (flags & OcgcoreCommonConstants.QUERY_COUNTERS) {
      size += 4 + (this.counters?.length || 0) * 4;
    }
    if (flags & OcgcoreCommonConstants.QUERY_OWNER) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_STATUS) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_LSCALE) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_RSCALE) size += 4;
    if (flags & OcgcoreCommonConstants.QUERY_LINK) size += 8;

    const result = new Uint8Array(size);
    const view = new DataView(result.buffer);
    let offset = 0;

    // 写入 flags
    view.setInt32(offset, this.flags, true);
    offset += 4;

    if (this.empty || this.flags === 0) {
      return result;
    }

    // 按顺序写入字段
    if (flags & OcgcoreCommonConstants.QUERY_CODE) {
      view.setInt32(offset, this.code || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_POSITION) {
      // 位置编码在高字节
      const pdata = ((this.position || 0) << 24) >>> 0;
      view.setInt32(offset, pdata, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_ALIAS) {
      view.setInt32(offset, this.alias || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_TYPE) {
      view.setInt32(offset, this.type || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_LEVEL) {
      view.setInt32(offset, this.level || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_RANK) {
      view.setInt32(offset, this.rank || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_ATTRIBUTE) {
      view.setInt32(offset, this.attribute || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_RACE) {
      view.setInt32(offset, this.race || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_ATTACK) {
      view.setInt32(offset, this.attack || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_DEFENSE) {
      view.setInt32(offset, this.defense || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_BASE_ATTACK) {
      view.setInt32(offset, this.baseAttack || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_BASE_DEFENSE) {
      view.setInt32(offset, this.baseDefense || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_REASON) {
      view.setInt32(offset, this.reason || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_REASON_CARD) {
      // QUERY_REASON_CARD 写入 0
      view.setInt32(offset, 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_EQUIP_CARD) {
      const card = this.equipCard || { controller: 0, location: 0, sequence: 0 };
      view.setUint8(offset, card.controller);
      view.setUint8(offset + 1, card.location);
      view.setUint8(offset + 2, card.sequence);
      view.setUint8(offset + 3, 0);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_TARGET_CARD) {
      const targets = this.targetCards || [];
      view.setInt32(offset, targets.length, true);
      offset += 4;
      for (const target of targets) {
        view.setUint8(offset, target.controller);
        view.setUint8(offset + 1, target.location);
        view.setUint8(offset + 2, target.sequence);
        view.setUint8(offset + 3, 0);
        offset += 4;
      }
    }

    if (flags & OcgcoreCommonConstants.QUERY_OVERLAY_CARD) {
      const overlays = this.overlayCards || [];
      view.setInt32(offset, overlays.length, true);
      offset += 4;
      for (const card of overlays) {
        view.setInt32(offset, card, true);
        offset += 4;
      }
    }

    if (flags & OcgcoreCommonConstants.QUERY_COUNTERS) {
      const counters = this.counters || [];
      view.setInt32(offset, counters.length, true);
      offset += 4;
      for (const counter of counters) {
        view.setUint16(offset, counter.type, true);
        view.setUint16(offset + 2, counter.count, true);
        offset += 4;
      }
    }

    if (flags & OcgcoreCommonConstants.QUERY_OWNER) {
      view.setInt32(offset, this.owner || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_STATUS) {
      view.setInt32(offset, this.status || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_LSCALE) {
      view.setInt32(offset, this.lscale || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_RSCALE) {
      view.setInt32(offset, this.rscale || 0, true);
      offset += 4;
    }

    if (flags & OcgcoreCommonConstants.QUERY_LINK) {
      view.setInt32(offset, this.link || 0, true);
      offset += 4;
      view.setInt32(offset, this.linkMarker || 0, true);
      offset += 4;
    }

    return new Uint8Array(view.buffer, view.byteOffset, offset);
  }
}
