import { OcgcoreCommonConstants } from '../src/vendor/ocgcore-constants';
import {
  YGOProMsgDraw,
  YGOProMsgHint,
  YGOProMsgWin,
  YGOProMsgNewTurn,
  YGOProMsgDamage,
  YGOProMsgShuffleHand,
  YGOProMsgConfirmDeckTop,
} from '../src/protos/msg/proto';
import { YGOProMessages } from '../src/protos/msg/registry';

describe('YGOPro MSG Serialization', () => {
  describe('Simple MSG types', () => {
    it('should serialize and deserialize MSG_WIN', () => {
      const msg = new YGOProMsgWin();
      msg.player = 0;
      msg.type = 1;

      const data = msg.toPayload();
      expect(data.length).toBe(3); // identifier + 2 bytes
      expect(data[0]).toBe(OcgcoreCommonConstants.MSG_WIN); // identifier
      expect(data[1]).toBe(0);
      expect(data[2]).toBe(1);

      const decoded = new YGOProMsgWin();
      decoded.fromPayload(data);

      expect(decoded.player).toBe(0);
      expect(decoded.type).toBe(1);
    });

    it('should serialize and deserialize MSG_HINT', () => {
      const msg = new YGOProMsgHint();
      msg.type = 10;
      msg.player = 1;
      msg.desc = 12345;

      const data = msg.toPayload();
      expect(data.length).toBe(7); // identifier + 6 bytes
      expect(data[0]).toBe(OcgcoreCommonConstants.MSG_HINT); // identifier

      const decoded = new YGOProMsgHint();
      decoded.fromPayload(data);

      expect(decoded.type).toBe(10);
      expect(decoded.player).toBe(1);
      expect(decoded.desc).toBe(12345);
    });

    it('should serialize and deserialize MSG_NEW_TURN', () => {
      const msg = new YGOProMsgNewTurn();
      msg.player = 1;

      const data = msg.toPayload();
      expect(data.length).toBe(2); // identifier + 1 byte
      expect(data[0]).toBe(OcgcoreCommonConstants.MSG_NEW_TURN); // identifier
      expect(data[1]).toBe(1);

      const decoded = new YGOProMsgNewTurn();
      decoded.fromPayload(data);

      expect(decoded.player).toBe(1);
    });

    it('should serialize and deserialize MSG_DAMAGE', () => {
      const msg = new YGOProMsgDamage();
      msg.player = 0;
      msg.value = 1000;

      const data = msg.toPayload();
      expect(data.length).toBe(6); // identifier + 5 bytes
      expect(data[0]).toBe(OcgcoreCommonConstants.MSG_DAMAGE); // identifier

      const decoded = new YGOProMsgDamage();
      decoded.fromPayload(data);

      expect(decoded.player).toBe(0);
      expect(decoded.value).toBe(1000);
    });

    it('should validate MSG identifier', () => {
      const data = new Uint8Array([99, 0, 0, 0, 0, 0]); // wrong identifier
      const msg = new YGOProMsgDamage();

      expect(() => msg.fromPayload(data)).toThrow('MSG type mismatch');
    });
  });

  describe('MSG types with arrays', () => {
    it('should serialize and deserialize MSG_DRAW', () => {
      const msg = new YGOProMsgDraw();
      msg.player = 0;
      msg.count = 3;
      msg.cards = [12345, 67890, 11111];

      const data = msg.toPayload();
      expect(data.length).toBe(1 + 2 + 3 * 4); // identifier + player + count + 3 cards
      expect(data[0]).toBe(OcgcoreCommonConstants.MSG_DRAW); // identifier

      const decoded = new YGOProMsgDraw();
      decoded.fromPayload(data);

      expect(decoded.player).toBe(0);
      expect(decoded.count).toBe(3);
      expect(decoded.cards).toEqual([12345, 67890, 11111]);
    });

    it('should implement opponentView for MSG_DRAW', () => {
      const msg = new YGOProMsgDraw();
      msg.player = 0;
      msg.count = 2;
      msg.cards = [12345, 0x80000000 | 67890]; // second card is public

      const opponentView = msg.opponentView();

      expect(opponentView.cards[0]).toBe(0); // hidden
      expect(opponentView.cards[1]).toBe(0x80000000 | 67890); // public
    });

    it('should serialize and deserialize MSG_SHUFFLE_HAND', () => {
      const msg = new YGOProMsgShuffleHand();
      msg.player = 1;
      msg.count = 4;
      msg.cards = [100, 200, 300, 400];

      const data = msg.toPayload();

      const decoded = new YGOProMsgShuffleHand();
      decoded.fromPayload(data);

      expect(decoded.player).toBe(1);
      expect(decoded.count).toBe(4);
      expect(decoded.cards).toEqual([100, 200, 300, 400]);
    });

    it('should implement opponentView for MSG_SHUFFLE_HAND', () => {
      const msg = new YGOProMsgShuffleHand();
      msg.player = 0;
      msg.count = 3;
      msg.cards = [100, 200, 300];

      const opponentView = msg.opponentView();

      expect(opponentView.cards).toEqual([0, 0, 0]);
    });
  });

  describe('MSG types with nested objects', () => {
    it('should serialize and deserialize MSG_CONFIRM_DECKTOP', () => {
      const msg = new YGOProMsgConfirmDeckTop();
      msg.player = 0;
      msg.count = 2;
      msg.cards = [
        { code: 12345, controller: 0, location: 1, sequence: 0 },
        { code: 67890, controller: 0, location: 1, sequence: 1 },
      ];

      const data = msg.toPayload();

      const decoded = new YGOProMsgConfirmDeckTop();
      decoded.fromPayload(data);

      expect(decoded.player).toBe(0);
      expect(decoded.count).toBe(2);
      expect(decoded.cards.length).toBe(2);
      expect(decoded.cards[0].code).toBe(12345);
      expect(decoded.cards[1].code).toBe(67890);
    });

    it('should implement opponentView for MSG_CONFIRM_DECKTOP', () => {
      const msg = new YGOProMsgConfirmDeckTop();
      msg.player = 0;
      msg.count = 2;
      msg.cards = [
        { code: 12345, controller: 0, location: 1, sequence: 0 },
        { code: 0x80000000 | 67890, controller: 0, location: 1, sequence: 1 },
      ];

      const opponentView = msg.opponentView();

      expect(opponentView.cards[0].code).toBe(0); // hidden
      expect(opponentView.cards[1].code).toBe(0x80000000 | 67890); // public
    });
  });

  describe('MSG Registry', () => {
    it('should have correct identifier', () => {
      expect(YGOProMsgWin.identifier).toBe(OcgcoreCommonConstants.MSG_WIN);
      expect(YGOProMsgHint.identifier).toBe(OcgcoreCommonConstants.MSG_HINT);
      expect(YGOProMsgDraw.identifier).toBe(OcgcoreCommonConstants.MSG_DRAW);
    });

    it('should retrieve class by identifier', () => {
      const WinClass = YGOProMessages.get(OcgcoreCommonConstants.MSG_WIN);
      expect(WinClass).toBe(YGOProMsgWin);

      const HintClass = YGOProMessages.get(OcgcoreCommonConstants.MSG_HINT);
      expect(HintClass).toBe(YGOProMsgHint);

      const DrawClass = YGOProMessages.get(OcgcoreCommonConstants.MSG_DRAW);
      expect(DrawClass).toBe(YGOProMsgDraw);
    });
  });

  describe('playerView helper', () => {
    it('should return self view for own player', () => {
      const msg = new YGOProMsgDraw();
      msg.player = 0;
      msg.count = 2;
      msg.cards = [12345, 67890];

      const view = msg.playerView(0);

      expect(view.cards).toEqual([12345, 67890]);
    });

    it('should return opponent view for other player', () => {
      const msg = new YGOProMsgDraw();
      msg.player = 0;
      msg.count = 2;
      msg.cards = [12345, 67890];

      const view = msg.playerView(1);

      expect(view.cards).toEqual([0, 0]);
    });
  });
});
