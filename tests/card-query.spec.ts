import { OcgcoreCommonConstants } from '../src/vendor/ocgcore-constants';
import { OcgcoreScriptConstants } from '../src/vendor/script-constants';
import {
  CardQuery,
  YGOProMsgUpdateCard,
  YGOProMsgUpdateData,
} from '../src/protos';

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

  it('should hide facedown card not on field for teammate', () => {
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

    // 除外区里侧，队友也看不到
    expect(teammateView.card.flags).toBe(OcgcoreCommonConstants.QUERY_CODE);
    expect(teammateView.card.code).toBe(0);
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
    expect(decoded.cards.length).toBe(3);

    // 验证卡片 1
    expect(decoded.cards[0].code).toBe(89631139);
    expect(decoded.cards[0].attack).toBe(3000);

    // 验证卡片 2（空位）
    expect(decoded.cards[1].empty).toBe(true);
    expect(decoded.cards[1].flags).toBe(0);

    // 验证卡片 3
    expect(decoded.cards[2].code).toBe(55144522);
    expect(decoded.cards[2].defense).toBe(2000);
  });

  it('should handle empty field', () => {
    const msg = new YGOProMsgUpdateData();
    msg.player = 1;
    msg.location = 5; // LOCATION_SZONE
    msg.cards = [];

    const data = msg.toPayload();
    const decoded = new YGOProMsgUpdateData();
    decoded.fromPayload(data);

    expect(decoded.player).toBe(1);
    expect(decoded.location).toBe(5);
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
});
