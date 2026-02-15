import { OcgcoreCommonConstants } from '../src/vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../src/vendor/script-constants';
import { YGOProMsgUpdateCard, YGOProMsgUpdateData } from '../src/protos';
import { CardQuery } from '../src/protos/common';

describe('CardQuery', () => {
  describe('Basic query fields', () => {
    it('should serialize and deserialize basic card info', () => {
      const card = new CardQuery();
      card.flags =
        OcgcoreCommonConstants.QUERY_CODE |
        OcgcoreCommonConstants.QUERY_POSITION |
        OcgcoreCommonConstants.QUERY_ATTACK |
        OcgcoreCommonConstants.QUERY_DEFENSE;
      card.code = 89631139; // 青眼白龙
      card.position = OcgcoreCommonConstants.POS_FACEUP_ATTACK;
      card.attack = 3000;
      card.defense = 2500;

      const data = card.toPayload();
      expect(data.length).toBeGreaterThan(0);

      const decoded = new CardQuery();
      decoded.fromPayload(data);

      expect(decoded.flags).toBe(card.flags);
      expect(decoded.code).toBe(89631139);
      expect(decoded.position).toBe(OcgcoreCommonConstants.POS_FACEUP_ATTACK);
      expect(decoded.attack).toBe(3000);
      expect(decoded.defense).toBe(2500);
    });

    it('should handle empty card', () => {
      const card = new CardQuery();
      card.flags = 0;
      card.empty = true;

      const data = card.toPayload();
      expect(data.length).toBe(4); // 只有 flags

      const decoded = new CardQuery();
      decoded.fromPayload(data);

      expect(decoded.flags).toBe(0);
      expect(decoded.empty).toBe(true);
    });

    it('should serialize and deserialize all scalar fields', () => {
      const card = new CardQuery();
      card.flags =
        OcgcoreCommonConstants.QUERY_CODE |
        OcgcoreCommonConstants.QUERY_ALIAS |
        OcgcoreCommonConstants.QUERY_TYPE |
        OcgcoreCommonConstants.QUERY_LEVEL |
        OcgcoreCommonConstants.QUERY_RANK |
        OcgcoreCommonConstants.QUERY_ATTRIBUTE |
        OcgcoreCommonConstants.QUERY_RACE |
        OcgcoreCommonConstants.QUERY_ATTACK |
        OcgcoreCommonConstants.QUERY_DEFENSE |
        OcgcoreCommonConstants.QUERY_BASE_ATTACK |
        OcgcoreCommonConstants.QUERY_BASE_DEFENSE |
        OcgcoreCommonConstants.QUERY_REASON |
        OcgcoreCommonConstants.QUERY_OWNER |
        OcgcoreCommonConstants.QUERY_STATUS |
        OcgcoreCommonConstants.QUERY_LSCALE |
        OcgcoreCommonConstants.QUERY_RSCALE;

      card.code = 12345;
      card.alias = 54321;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;
      card.level = 4;
      card.rank = 0;
      card.attribute = OcgcoreCommonConstants.ATTRIBUTE_LIGHT;
      card.race = OcgcoreCommonConstants.RACE_WARRIOR;
      card.attack = 1800;
      card.defense = 1000;
      card.baseAttack = 1800;
      card.baseDefense = 1000;
      card.reason = 0;
      card.owner = 0;
      card.status = 0;
      card.lscale = 1;
      card.rscale = 1;

      const data = card.toPayload();
      const decoded = new CardQuery();
      decoded.fromPayload(data);

      expect(decoded.code).toBe(12345);
      expect(decoded.alias).toBe(54321);
      expect(decoded.type).toBe(OcgcoreCommonConstants.TYPE_MONSTER);
      expect(decoded.level).toBe(4);
      expect(decoded.attribute).toBe(OcgcoreCommonConstants.ATTRIBUTE_LIGHT);
      expect(decoded.race).toBe(OcgcoreCommonConstants.RACE_WARRIOR);
      expect(decoded.attack).toBe(1800);
      expect(decoded.defense).toBe(1000);
      expect(decoded.lscale).toBe(1);
      expect(decoded.rscale).toBe(1);
    });
  });

  describe('Array fields', () => {
    it('should serialize and deserialize overlay cards', () => {
      const card = new CardQuery();
      card.flags = OcgcoreCommonConstants.QUERY_OVERLAY_CARD;
      card.overlayCards = [12345, 67890, 11111];

      const data = card.toPayload();
      const decoded = new CardQuery();
      decoded.fromPayload(data);

      expect(decoded.overlayCards).toEqual([12345, 67890, 11111]);
    });

    it('should serialize and deserialize target cards', () => {
      const card = new CardQuery();
      card.flags = OcgcoreCommonConstants.QUERY_TARGET_CARD;
      card.targetCards = [
        { controller: 0, location: 4, sequence: 0 },
        { controller: 1, location: 4, sequence: 1 },
      ];

      const data = card.toPayload();
      const decoded = new CardQuery();
      decoded.fromPayload(data);

      expect(decoded.targetCards?.length).toBe(2);
      expect(decoded.targetCards?.[0]).toEqual({
        controller: 0,
        location: 4,
        sequence: 0,
      });
      expect(decoded.targetCards?.[1]).toEqual({
        controller: 1,
        location: 4,
        sequence: 1,
      });
    });

    it('should serialize and deserialize counters', () => {
      const card = new CardQuery();
      card.flags = OcgcoreCommonConstants.QUERY_COUNTERS;
      card.counters = [
        { type: 0x1015, count: 3 },
        { type: 0x1016, count: 2 },
      ];

      const data = card.toPayload();
      const decoded = new CardQuery();
      decoded.fromPayload(data);

      expect(decoded.counters?.length).toBe(2);
      expect(decoded.counters?.[0]).toEqual({ type: 0x1015, count: 3 });
      expect(decoded.counters?.[1]).toEqual({ type: 0x1016, count: 2 });
    });

    it('should serialize and deserialize equip card', () => {
      const card = new CardQuery();
      card.flags = OcgcoreCommonConstants.QUERY_EQUIP_CARD;
      card.equipCard = { controller: 0, location: 4, sequence: 2 };

      const data = card.toPayload();
      const decoded = new CardQuery();
      decoded.fromPayload(data);

      expect(decoded.equipCard).toEqual({
        controller: 0,
        location: 4,
        sequence: 2,
      });
    });
  });

  describe('Link cards', () => {
    it('should serialize and deserialize link fields', () => {
      const card = new CardQuery();
      card.flags = OcgcoreCommonConstants.QUERY_LINK;
      card.link = 2;
      card.linkMarker = 0x0a; // top-left + top-right

      const data = card.toPayload();
      const decoded = new CardQuery();
      decoded.fromPayload(data);

      expect(decoded.link).toBe(2);
      expect(decoded.linkMarker).toBe(0x0a);
    });
  });
});

describe('MSG_UPDATE_CARD', () => {
  it('should serialize and deserialize with card query', () => {
    const msg = new YGOProMsgUpdateCard();
    msg.controller = 0;
    msg.location = 4; // LOCATION_MZONE
    msg.sequence = 0;

    msg.card = new CardQuery();
    msg.card.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION |
      OcgcoreCommonConstants.QUERY_ATTACK |
      OcgcoreCommonConstants.QUERY_DEFENSE;
    msg.card.code = 89631139;
    msg.card.position = OcgcoreCommonConstants.POS_FACEUP_ATTACK;
    msg.card.attack = 3000;
    msg.card.defense = 2500;

    const data = msg.toPayload();
    expect(data[0]).toBe(OcgcoreCommonConstants.MSG_UPDATE_CARD);

    const decoded = new YGOProMsgUpdateCard();
    decoded.fromPayload(data);

    expect(decoded.controller).toBe(0);
    expect(decoded.location).toBe(4);
    expect(decoded.sequence).toBe(0);
    expect(decoded.card.code).toBe(89631139);
    expect(decoded.card.attack).toBe(3000);
    expect(decoded.card.defense).toBe(2500);
  });

  it('should handle LEN_EMPTY query block', () => {
    const msg = new YGOProMsgUpdateCard();
    msg.controller = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_MZONE;
    msg.sequence = 1;
    msg.card = new CardQuery();
    msg.card.flags = 0;
    msg.card.empty = true;

    const data = msg.toPayload();
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    expect(view.getInt32(4, true)).toBe(4);
    expect(data.length).toBe(8); // 4 bytes header + LEN_EMPTY

    const decoded = new YGOProMsgUpdateCard();
    decoded.fromPayload(data);
    expect(decoded.card.flags).toBe(0);
    expect(decoded.card.empty).toBe(true);
    expect(decoded.card.queryLength).toBe(4);
  });

  it('should preserve masked query length when re-encoding', () => {
    const data = new Uint8Array(16);
    const view = new DataView(data.buffer);
    data[0] = OcgcoreCommonConstants.MSG_UPDATE_CARD;
    data[1] = 0;
    data[2] = OcgcoreScriptConstants.LOCATION_MZONE;
    data[3] = 0;
    view.setInt32(4, 12, true); // 保留原始 query 长度
    // 其余 8 字节保持 0，表示被屏蔽后的数据

    const decoded = new YGOProMsgUpdateCard();
    decoded.fromPayload(data);
    expect(decoded.card.flags).toBe(0);
    expect(decoded.card.queryLength).toBe(12);

    const encoded = decoded.toPayload();
    const encodedView = new DataView(
      encoded.buffer,
      encoded.byteOffset,
      encoded.byteLength,
    );
    expect(encoded.length).toBe(16);
    expect(encodedView.getInt32(4, true)).toBe(12);
  });

  it('should hide facedown card info in opponent view', () => {
    const msg = new YGOProMsgUpdateCard();
    msg.controller = 0;
    msg.location = 4; // LOCATION_MZONE
    msg.sequence = 0;

    msg.card = new CardQuery();
    msg.card.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION |
      OcgcoreCommonConstants.QUERY_ATTACK |
      OcgcoreCommonConstants.QUERY_DEFENSE;
    msg.card.code = 89631139;
    msg.card.position = OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE; // 盖放
    msg.card.attack = 3000;
    msg.card.defense = 2500;

    const opponentView = msg.opponentView();

    // 盖放的卡片，对手只能看到 flags = QUERY_CODE 和 code = 0
    expect(opponentView.card.flags).toBe(OcgcoreCommonConstants.QUERY_CODE);
    expect(opponentView.card.code).toBe(0);
    expect(opponentView.card.attack).toBeUndefined();
    expect(opponentView.card.defense).toBeUndefined();
    expect(opponentView.card.position).toBeUndefined();
  });

  it('should not hide faceup card info in opponent view', () => {
    const msg = new YGOProMsgUpdateCard();
    msg.controller = 0;
    msg.location = 4; // LOCATION_MZONE
    msg.sequence = 0;

    msg.card = new CardQuery();
    msg.card.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION |
      OcgcoreCommonConstants.QUERY_ATTACK;
    msg.card.code = 89631139;
    msg.card.position = OcgcoreCommonConstants.POS_FACEUP_ATTACK; // 表侧
    msg.card.attack = 3000;

    const opponentView = msg.opponentView();

    // 表侧的卡片，对手可以看到所有信息
    expect(opponentView.card.code).toBe(89631139);
    expect(opponentView.card.position).toBe(
      OcgcoreCommonConstants.POS_FACEUP_ATTACK,
    );
    expect(opponentView.card.attack).toBe(3000);
  });

  it('should preserve UPDATE_CARD chunk length after hiding without queryLength', () => {
    const msg = new YGOProMsgUpdateCard();
    msg.controller = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_MZONE;
    msg.sequence = 0;

    msg.card = new CardQuery();
    msg.card.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION |
      OcgcoreCommonConstants.QUERY_ATTACK |
      OcgcoreCommonConstants.QUERY_DEFENSE;
    msg.card.code = 89631139;
    msg.card.position = OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE;
    msg.card.attack = 3000;
    msg.card.defense = 2500;

    const selfData = msg.toPayload();
    const selfView = new DataView(
      selfData.buffer,
      selfData.byteOffset,
      selfData.byteLength,
    );
    const selfChunkLen = selfView.getInt32(4, true);

    const opponentData = msg.opponentView().toPayload();
    const opponentView = new DataView(
      opponentData.buffer,
      opponentData.byteOffset,
      opponentData.byteLength,
    );
    const opponentChunkLen = opponentView.getInt32(4, true);

    expect(opponentData.length).toBe(selfData.length);
    expect(opponentChunkLen).toBe(selfChunkLen);
  });

  it('should allow teammate to see facedown card on field', () => {
    const msg = new YGOProMsgUpdateCard();
    msg.controller = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_MZONE; // 场上
    msg.sequence = 0;

    msg.card = new CardQuery();
    msg.card.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION |
      OcgcoreCommonConstants.QUERY_DEFENSE;
    msg.card.code = 12345;
    msg.card.position = OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE; // 盖放
    msg.card.defense = 2000;

    const teammateView = msg.teammateView();

    // 场上盖放的卡片，队友可以看到完整信息
    expect(teammateView.card.code).toBe(12345);
    expect(teammateView.card.position).toBe(
      OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE,
    );
    expect(teammateView.card.defense).toBe(2000);
  });

  it('should keep full data for teammate even when card is not on field', () => {
    const msg = new YGOProMsgUpdateCard();
    msg.controller = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_REMOVED; // 除外区
    msg.sequence = 0;

    msg.card = new CardQuery();
    msg.card.flags =
      OcgcoreCommonConstants.QUERY_CODE | OcgcoreCommonConstants.QUERY_POSITION;
    msg.card.code = 12345;
    msg.card.position = OcgcoreCommonConstants.POS_FACEDOWN; // 里侧除外

    const teammateView = msg.teammateView();

    // TAG 模式下 RefreshSingle 会把完整 UPDATE_CARD 发给同队玩家
    expect(teammateView.card.flags).toBe(
      OcgcoreCommonConstants.QUERY_CODE | OcgcoreCommonConstants.QUERY_POSITION,
    );
    expect(teammateView.card.code).toBe(12345);
    expect(teammateView.card.position).toBe(OcgcoreCommonConstants.POS_FACEDOWN);
  });

  it('should use controller field in playerView', () => {
    const msg = new YGOProMsgUpdateCard();
    msg.controller = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_MZONE;
    msg.sequence = 0;

    msg.card = new CardQuery();
    msg.card.flags =
      OcgcoreCommonConstants.QUERY_CODE | OcgcoreCommonConstants.QUERY_POSITION;
    msg.card.code = 12345;
    msg.card.position = OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE;

    // 控制者（玩家 0）可以看到完整数据
    const selfView = msg.playerView(0);
    expect(selfView.card.code).toBe(12345);
    expect(selfView.card.position).toBe(
      OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE,
    );

    // 对手（玩家 1）看不到盖放的卡
    const opponentView = msg.playerView(1);
    expect(opponentView.card.flags).toBe(OcgcoreCommonConstants.QUERY_CODE);
    expect(opponentView.card.code).toBe(0);
  });
});

describe('MSG_UPDATE_DATA', () => {
  it('should serialize and deserialize with multiple cards', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = 4; // LOCATION_MZONE

    // 创建 3 张卡片的查询数据
    msg.cards = [];

    // 卡片 1
    const card1 = new CardQuery();
    card1.flags =
      OcgcoreCommonConstants.QUERY_CODE | OcgcoreCommonConstants.QUERY_ATTACK;
    card1.code = 89631139;
    card1.attack = 3000;
    msg.cards.push(card1);

    // 卡片 2 - 空位
    const card2 = new CardQuery();
    card2.flags = 0;
    card2.empty = true;
    msg.cards.push(card2);

    // 卡片 3
    const card3 = new CardQuery();
    card3.flags =
      OcgcoreCommonConstants.QUERY_CODE | OcgcoreCommonConstants.QUERY_DEFENSE;
    card3.code = 55144522;
    card3.defense = 2000;
    msg.cards.push(card3);

    const data = msg.toPayload();
    expect(data[0]).toBe(6); // MSG_UPDATE_DATA

    const decoded = new YGOProMsgUpdateData();
    decoded.fromPayload(data);

    expect(decoded.player).toBe(0);
    expect(decoded.location).toBe(4);
    expect(decoded.cards.length).toBe(7);

    // 验证卡片 1
    expect(decoded.cards[0].code).toBe(89631139);
    expect(decoded.cards[0].attack).toBe(3000);

    // 验证卡片 2（空位）
    expect(decoded.cards[1].empty).toBe(true);
    expect(decoded.cards[1].flags).toBe(0);

    // 验证卡片 3
    expect(decoded.cards[2].code).toBe(55144522);
    expect(decoded.cards[2].defense).toBe(2000);

    // MZONE 固定 7 槽，剩余为空槽
    for (let i = 3; i < 7; i++) {
      expect(decoded.cards[i].empty).toBe(true);
      expect(decoded.cards[i].flags).toBe(0);
    }
  });

  it('should handle empty field', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 1;
    msg.location = OcgcoreScriptConstants.LOCATION_HAND;
    msg.cards = [];

    const data = msg.toPayload();
    const decoded = new YGOProMsgUpdateData();
    decoded.fromPayload(data);

    expect(decoded.player).toBe(1);
    expect(decoded.location).toBe(OcgcoreScriptConstants.LOCATION_HAND);
    expect(decoded.cards.length).toBe(0);
  });

  it('should hide facedown cards in opponent view', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = 4; // LOCATION_MZONE
    msg.cards = [];

    // 卡片 1 - 表侧
    const card1 = new CardQuery();
    card1.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION |
      OcgcoreCommonConstants.QUERY_ATTACK;
    card1.code = 89631139;
    card1.position = OcgcoreCommonConstants.POS_FACEUP_ATTACK;
    card1.attack = 3000;
    msg.cards.push(card1);

    // 卡片 2 - 盖放
    const card2 = new CardQuery();
    card2.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION |
      OcgcoreCommonConstants.QUERY_DEFENSE;
    card2.code = 12345;
    card2.position = OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE;
    card2.defense = 2000;
    msg.cards.push(card2);

    // 卡片 3 - 表侧
    const card3 = new CardQuery();
    card3.flags =
      OcgcoreCommonConstants.QUERY_CODE | OcgcoreCommonConstants.QUERY_POSITION;
    card3.code = 67890;
    card3.position = OcgcoreCommonConstants.POS_FACEUP_DEFENSE;
    msg.cards.push(card3);

    const opponentView = msg.opponentView();

    expect(opponentView.cards.length).toBe(3);

    // 卡片 1 - 表侧，对手可见
    expect(opponentView.cards[0].code).toBe(89631139);
    expect(opponentView.cards[0].position).toBe(
      OcgcoreCommonConstants.POS_FACEUP_ATTACK,
    );
    expect(opponentView.cards[0].attack).toBe(3000);

    // 卡片 2 - 盖放，对手不可见
    expect(opponentView.cards[1].empty).toBe(true);
    expect(opponentView.cards[1].flags).toBe(0);
    expect(opponentView.cards[1].code).toBeUndefined();
    expect(opponentView.cards[1].defense).toBeUndefined();

    // 卡片 3 - 表侧，对手可见
    expect(opponentView.cards[2].code).toBe(67890);
    expect(opponentView.cards[2].position).toBe(
      OcgcoreCommonConstants.POS_FACEUP_DEFENSE,
    );
  });

  it('should allow teammate to see facedown cards on field (MZONE/SZONE)', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_MZONE; // 场上
    msg.cards = [];

    // 盖放的卡片
    const card = new CardQuery();
    card.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION |
      OcgcoreCommonConstants.QUERY_DEFENSE;
    card.code = 12345;
    card.position = OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE;
    card.defense = 2000;
    msg.cards.push(card);

    const teammateView = msg.teammateView();

    // 场上盖放的卡片，队友可以看到
    expect(teammateView.cards[0].code).toBe(12345);
    expect(teammateView.cards[0].position).toBe(
      OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE,
    );
    expect(teammateView.cards[0].defense).toBe(2000);
  });

  it('should hide non-public hand cards from teammate', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_HAND; // 手牌
    msg.cards = [];

    // 非公开手牌
    const card1 = new CardQuery();
    card1.flags =
      OcgcoreCommonConstants.QUERY_CODE | OcgcoreCommonConstants.QUERY_POSITION;
    card1.code = 12345;
    card1.position = 0; // 非公开
    msg.cards.push(card1);

    // 公开手牌
    const card2 = new CardQuery();
    card2.flags =
      OcgcoreCommonConstants.QUERY_CODE | OcgcoreCommonConstants.QUERY_POSITION;
    card2.code = 67890;
    card2.position = OcgcoreCommonConstants.POS_FACEUP; // 公开
    msg.cards.push(card2);

    const teammateView = msg.teammateView();

    // 非公开手牌，队友也看不到
    expect(teammateView.cards[0].empty).toBe(true);
    expect(teammateView.cards[0].flags).toBe(0);

    // 公开手牌，队友可以看到
    expect(teammateView.cards[1].code).toBe(67890);
    expect(teammateView.cards[1].position).toBe(
      OcgcoreCommonConstants.POS_FACEUP,
    );
  });

  it('should use player field in playerView', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_MZONE;
    msg.cards = [];

    const card = new CardQuery();
    card.flags =
      OcgcoreCommonConstants.QUERY_CODE | OcgcoreCommonConstants.QUERY_POSITION;
    card.code = 12345;
    card.position = OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE;
    msg.cards.push(card);

    // 控制者（玩家 0）可以看到完整数据
    const selfView = msg.playerView(0);
    expect(selfView.cards[0].code).toBe(12345);
    expect(selfView.cards[0].position).toBe(
      OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE,
    );

    // 对手（玩家 1）看不到盖放的卡
    const opponentView = msg.playerView(1);
    expect(opponentView.cards[0].empty).toBe(true);
    expect(opponentView.cards[0].flags).toBe(0);
  });

  it('should hide non-faceup hand cards in opponent view', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_HAND;
    msg.cards = [];

    const hiddenCard = new CardQuery();
    hiddenCard.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION;
    hiddenCard.code = 12345;
    hiddenCard.position = 0; // 非公开手牌
    msg.cards.push(hiddenCard);

    const publicCard = new CardQuery();
    publicCard.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION;
    publicCard.code = 67890;
    publicCard.position = OcgcoreCommonConstants.POS_FACEUP;
    msg.cards.push(publicCard);

    const opponentView = msg.opponentView();
    expect(opponentView.cards[0].empty).toBe(true);
    expect(opponentView.cards[0].flags).toBe(0);
    expect(opponentView.cards[1].code).toBe(67890);
  });

  it('should preserve UPDATE_DATA chunk length after hiding without queryLength', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_HAND;
    msg.cards = [];

    const hiddenCard = new CardQuery();
    hiddenCard.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION |
      OcgcoreCommonConstants.QUERY_ATTACK;
    hiddenCard.code = 12345;
    hiddenCard.position = 0; // 非公开手牌
    hiddenCard.attack = 1000;
    msg.cards.push(hiddenCard);

    const selfData = msg.toPayload();
    const selfView = new DataView(
      selfData.buffer,
      selfData.byteOffset,
      selfData.byteLength,
    );
    const selfChunkLen = selfView.getInt32(3, true);

    const opponentData = msg.opponentView().toPayload();
    const opponentView = new DataView(
      opponentData.buffer,
      opponentData.byteOffset,
      opponentData.byteLength,
    );
    const opponentChunkLen = opponentView.getInt32(3, true);

    expect(opponentData.length).toBe(selfData.length);
    expect(opponentChunkLen).toBe(selfChunkLen);
  });

  it('should hide facedown extra cards from teammate', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_EXTRA;
    msg.cards = [];

    const card = new CardQuery();
    card.flags =
      OcgcoreCommonConstants.QUERY_CODE |
      OcgcoreCommonConstants.QUERY_POSITION;
    card.code = 12345;
    card.position = OcgcoreCommonConstants.POS_FACEDOWN_DEFENSE;
    msg.cards.push(card);

    const teammateView = msg.teammateView();
    expect(teammateView.cards[0].empty).toBe(true);
    expect(teammateView.cards[0].flags).toBe(0);
  });

  it('should encode empty slot as LEN_EMPTY (4 bytes)', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_MZONE;
    msg.cards = [];

    const emptySlot = new CardQuery();
    emptySlot.flags = 0;
    emptySlot.empty = true;
    msg.cards.push(emptySlot);

    const data = msg.toPayload();
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    expect(view.getInt32(3, true)).toBe(4);
    expect(data.length).toBe(31); // identifier + player + location + 7*LEN_EMPTY
  });

  it('should preserve masked chunk length when re-encoding', () => {
    const data = new Uint8Array(15);
    const view = new DataView(data.buffer);
    data[0] = 6; // MSG_UPDATE_DATA
    data[1] = 0;
    data[2] = OcgcoreScriptConstants.LOCATION_HAND;
    view.setInt32(3, 12, true); // 原始 chunk 长度（含长度字段）
    // 其余 8 字节保持为 0，表示被屏蔽后的查询数据

    const decoded = new YGOProMsgUpdateData();
    decoded.fromPayload(data);
    expect(decoded.cards[0].flags).toBe(0);
    expect(decoded.cards[0].empty).toBe(true);
    expect(decoded.cards[0].queryLength).toBe(12);

    const encoded = decoded.toPayload();
    const encodedView = new DataView(
      encoded.buffer,
      encoded.byteOffset,
      encoded.byteLength,
    );
    expect(encoded.length).toBe(15);
    expect(encodedView.getInt32(3, true)).toBe(12);
  });

  it('should pad MZONE to 7 LEN_EMPTY chunks', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_MZONE;
    msg.cards = [];

    const data = msg.toPayload();
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    expect(data.length).toBe(3 + 7 * 4);
    for (let i = 0; i < 7; i++) {
      expect(view.getInt32(3 + i * 4, true)).toBe(4);
    }
  });

  it('should pad SZONE to 8 LEN_EMPTY chunks', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_SZONE;
    msg.cards = [];

    const data = msg.toPayload();
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    expect(data.length).toBe(3 + 8 * 4);
    for (let i = 0; i < 8; i++) {
      expect(view.getInt32(3 + i * 4, true)).toBe(4);
    }
  });

  it('should reject too many chunks for fixed-size zones', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 0;
    msg.location = OcgcoreScriptConstants.LOCATION_MZONE;
    msg.cards = [];
    for (let i = 0; i < 8; i++) {
      const empty = new CardQuery();
      empty.flags = 0;
      empty.empty = true;
      msg.cards.push(empty);
    }

    expect(() => msg.toPayload()).toThrow(
      'expects at most 7 chunks, got 8',
    );
  });
});
