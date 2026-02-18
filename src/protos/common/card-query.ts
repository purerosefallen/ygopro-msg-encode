import { OcgcoreCommonConstants } from '../../vendor/ocgcore-constants';

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
  // MSG_UPDATE_DATA 每个卡片块的原始总长度（包含 4 字节长度字段）
  queryLength?: number;
  // QUERY_POSITION 的原始 32 位信息（controller/location/sequence/position）
  positionData?: number;
  // QUERY_REASON_CARD 的原始 32 位信息（info_location）
  reasonCardData?: number;
  // QUERY_EQUIP_CARD 的原始 32 位信息（info_location）
  equipCardData?: number;
  // QUERY_TARGET_CARD 各目标的原始 32 位信息（info_location）
  targetCardData?: number[];

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
      const pdata = view.getUint32(offset, true);
      this.positionData = pdata;
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
      this.reasonCardData = view.getUint32(offset, true);
      offset += 4;
    }

    if (this.flags & OcgcoreCommonConstants.QUERY_EQUIP_CARD) {
      const pdata = view.getUint32(offset, true);
      this.equipCardData = pdata;
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
      this.targetCardData = [];
      for (let i = 0; i < count; i++) {
        this.targetCardData.push(view.getUint32(offset, true));
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
    return serializeCardQuery(this);
  }
}

export function serializeCardQuery(card?: Partial<CardQuery>): Uint8Array {
  const source = card || {};
  const flags = source.flags || 0;

  // 计算总大小
  let size = 4; // flags

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
    size += 4 + (source.targetCards?.length || 0) * 4;
  }
  if (flags & OcgcoreCommonConstants.QUERY_OVERLAY_CARD) {
    size += 4 + (source.overlayCards?.length || 0) * 4;
  }
  if (flags & OcgcoreCommonConstants.QUERY_COUNTERS) {
    size += 4 + (source.counters?.length || 0) * 4;
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
  view.setInt32(offset, flags, true);
  offset += 4;

  if (source.empty || flags === 0) {
    return result;
  }

  // 按顺序写入字段
  if (flags & OcgcoreCommonConstants.QUERY_CODE) {
    view.setInt32(offset, source.code || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_POSITION) {
    // QUERY_POSITION 在 ocgcore 中是完整 info_location（不是只有 position）
    const pdata =
      source.positionData !== undefined
        ? source.positionData >>> 0
        : ((source.position || 0) << 24) >>> 0;
    view.setUint32(offset, pdata, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_ALIAS) {
    view.setInt32(offset, source.alias || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_TYPE) {
    view.setInt32(offset, source.type || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_LEVEL) {
    view.setInt32(offset, source.level || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_RANK) {
    view.setInt32(offset, source.rank || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_ATTRIBUTE) {
    view.setInt32(offset, source.attribute || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_RACE) {
    view.setInt32(offset, source.race || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_ATTACK) {
    view.setInt32(offset, source.attack || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_DEFENSE) {
    view.setInt32(offset, source.defense || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_BASE_ATTACK) {
    view.setInt32(offset, source.baseAttack || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_BASE_DEFENSE) {
    view.setInt32(offset, source.baseDefense || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_REASON) {
    view.setInt32(offset, source.reason || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_REASON_CARD) {
    view.setUint32(offset, (source.reasonCardData || 0) >>> 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_EQUIP_CARD) {
    if (source.equipCardData !== undefined) {
      view.setUint32(offset, source.equipCardData >>> 0, true);
      offset += 4;
    } else {
      const equipCard = source.equipCard || {
        controller: 0,
        location: 0,
        sequence: 0,
      };
      view.setUint8(offset, equipCard.controller);
      view.setUint8(offset + 1, equipCard.location);
      view.setUint8(offset + 2, equipCard.sequence);
      view.setUint8(offset + 3, 0);
      offset += 4;
    }
  }

  if (flags & OcgcoreCommonConstants.QUERY_TARGET_CARD) {
    const targets = source.targetCards || [];
    view.setInt32(offset, targets.length, true);
    offset += 4;
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const rawTarget = source.targetCardData?.[i];
      if (rawTarget !== undefined) {
        view.setUint32(offset, rawTarget >>> 0, true);
      } else {
        view.setUint8(offset, target.controller);
        view.setUint8(offset + 1, target.location);
        view.setUint8(offset + 2, target.sequence);
        view.setUint8(offset + 3, 0);
      }
      offset += 4;
    }
  }

  if (flags & OcgcoreCommonConstants.QUERY_OVERLAY_CARD) {
    const overlays = source.overlayCards || [];
    view.setInt32(offset, overlays.length, true);
    offset += 4;
    for (const card of overlays) {
      view.setInt32(offset, card, true);
      offset += 4;
    }
  }

  if (flags & OcgcoreCommonConstants.QUERY_COUNTERS) {
    const counters = source.counters || [];
    view.setInt32(offset, counters.length, true);
    offset += 4;
    for (const counter of counters) {
      view.setUint16(offset, counter.type, true);
      view.setUint16(offset + 2, counter.count, true);
      offset += 4;
    }
  }

  if (flags & OcgcoreCommonConstants.QUERY_OWNER) {
    view.setInt32(offset, source.owner || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_STATUS) {
    view.setInt32(offset, source.status || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_LSCALE) {
    view.setInt32(offset, source.lscale || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_RSCALE) {
    view.setInt32(offset, source.rscale || 0, true);
    offset += 4;
  }

  if (flags & OcgcoreCommonConstants.QUERY_LINK) {
    view.setInt32(offset, source.link || 0, true);
    offset += 4;
    view.setInt32(offset, source.linkMarker || 0, true);
    offset += 4;
  }

  return new Uint8Array(view.buffer, view.byteOffset, offset);
}

export interface CardQueryChunk {
  length: number;
  payload: Uint8Array;
}

export function parseCardQueryChunk(
  data: Uint8Array,
  offset = 0,
  context = 'CardQuery',
): { card: CardQuery; length: number } {
  if (offset + 4 > data.length) {
    throw new Error(`${context} chunk header truncated`);
  }

  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const length = view.getInt32(offset, true);
  if (length < 4) {
    throw new Error(`${context} invalid chunk length: ${length}`);
  }
  if (offset + length > data.length) {
    throw new Error(`${context} chunk payload truncated`);
  }

  const card = new CardQuery();
  card.queryLength = length;

  if (length === 4) {
    card.flags = 0;
    card.empty = true;
    return { card, length };
  }

  const payload = data.slice(offset + 4, offset + length);
  card.fromPayload(payload);
  return { card, length };
}

export function serializeCardQueryChunk(card?: Partial<CardQuery>): CardQueryChunk {
  const flags = card?.flags ?? 0;
  const queryLength = card?.queryLength;

  // 空槽位（LEN_EMPTY）
  if (flags === 0 && card?.empty && (!queryLength || queryLength <= 4)) {
    return { length: 4, payload: new Uint8Array(0) };
  }

  // 被屏蔽的卡片数据通常全 0，保留原始 chunk 长度用于转发
  if (flags === 0 && queryLength && queryLength > 4) {
    return { length: queryLength, payload: new Uint8Array(queryLength - 4) };
  }

  const payload = serializeCardQuery(card);
  const minimalLength = 4 + payload.length;
  if (queryLength && queryLength > minimalLength) {
    const padded = new Uint8Array(queryLength - 4);
    padded.set(payload, 0);
    return { length: queryLength, payload: padded };
  }
  return { length: minimalLength, payload };
}

function inferCardQueryChunkLength(source?: Partial<CardQuery>): number | undefined {
  if (!source) {
    return undefined;
  }
  if (typeof source.queryLength === 'number' && source.queryLength >= 4) {
    return source.queryLength;
  }
  const flags = source.flags ?? 0;
  if (flags === 0 && source.empty) {
    return 4;
  }
  const payload = serializeCardQuery(source);
  return 4 + payload.length;
}

export function createClearedCardQuery(
  source?: Partial<CardQuery>,
): CardQuery {
  const card = new CardQuery();
  card.flags = 0;
  card.empty = true;
  card.queryLength = inferCardQueryChunkLength(source);
  return card;
}

export function createCodeHiddenCardQuery(
  source?: Partial<CardQuery>,
): CardQuery {
  const card = new CardQuery();
  card.flags = OcgcoreCommonConstants.QUERY_CODE;
  card.code = 0;
  card.empty = false;
  card.queryLength = inferCardQueryChunkLength(source);
  return card;
}
