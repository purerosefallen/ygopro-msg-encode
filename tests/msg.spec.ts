import { OcgcoreCommonConstants } from '../src/vendor/ocgcore-constants';
import {
  YGOProMsgDraw,
  YGOProMsgHint,
  YGOProMsgWin,
  YGOProMsgNewTurn,
  YGOProMsgDamage,
  YGOProMsgShuffleExtra,
  YGOProMsgShuffleHand,
  YGOProMsgTagSwap,
  YGOProMsgSelectCard,
  YGOProMsgSelectTribute,
  YGOProMsgSelectUnselectCard,
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

    it('should not mutate original MSG_DRAW in opponentView', () => {
      const msg = new YGOProMsgDraw();
      msg.player = 0;
      msg.count = 2;
      msg.cards = [12345, 0x80000000 | 67890];

      const opponentView = msg.opponentView();

      expect(opponentView).not.toBe(msg);
      expect(msg.cards).toEqual([12345, 0x80000000 | 67890]);
      expect(opponentView.cards).toEqual([0, 0x80000000 | 67890]);
    });

    it('should implement teammateView for MSG_DRAW', () => {
      const msg = new YGOProMsgDraw();
      msg.player = 0;
      msg.count = 2;
      msg.cards = [12345, 0x80000000 | 67890];

      const teammateView = msg.teammateView();

      expect(teammateView.cards).toEqual([0, 0x80000000 | 67890]);
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

    it('should implement teammateView for MSG_SHUFFLE_HAND', () => {
      const msg = new YGOProMsgShuffleHand();
      msg.player = 0;
      msg.count = 3;
      msg.cards = [100, 200, 300];

      const teammateView = msg.teammateView();

      expect(teammateView.cards).toEqual([0, 0, 0]);
    });

    it('should implement teammateView for MSG_SHUFFLE_EXTRA', () => {
      const msg = new YGOProMsgShuffleExtra();
      msg.player = 1;
      msg.count = 3;
      msg.cards = [100, 200, 300];

      const teammateView = msg.teammateView();

      expect(teammateView.cards).toEqual([0, 0, 0]);
    });

    it('should serialize and deserialize MSG_TAG_SWAP with topCode', () => {
      const msg = new YGOProMsgTagSwap();
      msg.player = 0;
      msg.mzoneCount = 30;
      msg.extraCount = 2;
      msg.pzoneCount = 1;
      msg.handCount = 2;
      msg.topCode = 123456;
      msg.handCards = [11111, 0x80000000 | 22222];
      msg.extraCards = [33333, 0x80000000 | 44444];

      const data = msg.toPayload();
      expect(data.length).toBe(1 + 9 + 2 * 4 + 2 * 4);
      expect(data[0]).toBe(OcgcoreCommonConstants.MSG_TAG_SWAP);

      const decoded = new YGOProMsgTagSwap();
      decoded.fromPayload(data);

      expect(decoded.player).toBe(0);
      expect(decoded.mzoneCount).toBe(30);
      expect(decoded.extraCount).toBe(2);
      expect(decoded.pzoneCount).toBe(1);
      expect(decoded.handCount).toBe(2);
      expect(decoded.topCode).toBe(123456);
      expect(decoded.handCards).toEqual([11111, 0x80000000 | 22222]);
      expect(decoded.extraCards).toEqual([33333, 0x80000000 | 44444]);
    });

    it('should implement opponentView and teammateView for MSG_TAG_SWAP', () => {
      const msg = new YGOProMsgTagSwap();
      msg.player = 1;
      msg.mzoneCount = 35;
      msg.extraCount = 2;
      msg.pzoneCount = 0;
      msg.handCount = 2;
      msg.topCode = 556677;
      msg.handCards = [11111, 0x80000000 | 22222];
      msg.extraCards = [33333, 0x80000000 | 44444];

      const opponentView = msg.opponentView();
      const teammateView = msg.teammateView();

      expect(opponentView.topCode).toBe(556677);
      expect(opponentView.handCards).toEqual([0, 0x80000000 | 22222]);
      expect(opponentView.extraCards).toEqual([0, 0x80000000 | 44444]);

      expect(teammateView.topCode).toBe(556677);
      expect(teammateView.handCards).toEqual([0, 0x80000000 | 22222]);
      expect(teammateView.extraCards).toEqual([0, 0x80000000 | 44444]);
    });
  });

  describe('Selection visibility masking', () => {
    it('should mask by playerView in MSG_SELECT_CARD', () => {
      const msg = new YGOProMsgSelectCard();
      msg.player = 0;
      msg.cancelable = 1;
      msg.min = 1;
      msg.max = 1;
      msg.count = 2;
      msg.cards = [
        { code: 11111, controller: 0, location: 4, sequence: 0, subsequence: 0 },
        { code: 22222, controller: 1, location: 4, sequence: 0, subsequence: 0 },
      ];

      const player0View = msg.playerView(0);
      const player1View = msg.playerView(1);

      expect(player0View.cards[0].code).toBe(11111);
      expect(player0View.cards[1].code).toBe(0);
      expect(player1View.cards[0].code).toBe(0);
      expect(player1View.cards[1].code).toBe(22222);
    });

    it('should mask by playerView in MSG_SELECT_TRIBUTE', () => {
      const msg = new YGOProMsgSelectTribute();
      msg.player = 1;
      msg.cancelable = 1;
      msg.min = 1;
      msg.max = 1;
      msg.count = 2;
      msg.cards = [
        { code: 33333, controller: 1, location: 4, sequence: 1, releaseParam: 0 },
        { code: 44444, controller: 0, location: 4, sequence: 2, releaseParam: 0 },
      ];

      const player1View = msg.playerView(1);
      const player0View = msg.playerView(0);

      expect(player1View.cards[0].code).toBe(33333);
      expect(player1View.cards[1].code).toBe(0);
      expect(player0View.cards[0].code).toBe(0);
      expect(player0View.cards[1].code).toBe(44444);
    });

    it('should mask by playerView in MSG_SELECT_UNSELECT_CARD', () => {
      const msg = new YGOProMsgSelectUnselectCard();
      msg.player = 0;
      msg.finishable = 1;
      msg.cancelable = 1;
      msg.min = 1;
      msg.max = 2;
      msg.selectableCount = 2;
      msg.selectableCards = [
        { code: 55555, controller: 0, location: 4, sequence: 0, subsequence: 0 },
        { code: 66666, controller: 1, location: 4, sequence: 1, subsequence: 0 },
      ];
      msg.unselectableCount = 2;
      msg.unselectableCards = [
        { code: 77777, controller: 0, location: 2, sequence: 0, subsequence: 0 },
        { code: 88888, controller: 1, location: 2, sequence: 1, subsequence: 0 },
      ];

      const player0View = msg.playerView(0);
      const player1View = msg.playerView(1);

      expect(player0View.selectableCards[0].code).toBe(55555);
      expect(player0View.selectableCards[1].code).toBe(0);
      expect(player0View.unselectableCards[0].code).toBe(77777);
      expect(player0View.unselectableCards[1].code).toBe(0);
      expect(player1View.selectableCards[0].code).toBe(0);
      expect(player1View.selectableCards[1].code).toBe(66666);
      expect(player1View.unselectableCards[0].code).toBe(0);
      expect(player1View.unselectableCards[1].code).toBe(88888);
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

    it('should keep card codes in opponentView for MSG_CONFIRM_DECKTOP', () => {
      const msg = new YGOProMsgConfirmDeckTop();
      msg.player = 0;
      msg.count = 2;
      msg.cards = [
        { code: 12345, controller: 0, location: 1, sequence: 0 },
        { code: 0x80000000 | 67890, controller: 0, location: 1, sequence: 1 },
      ];

      const opponentView = msg.opponentView();

      expect(opponentView.cards[0].code).toBe(12345);
      expect(opponentView.cards[1].code).toBe(0x80000000 | 67890);
    });

    it('should not mutate original MSG_CONFIRM_DECKTOP in opponentView', () => {
      const msg = new YGOProMsgConfirmDeckTop();
      msg.player = 0;
      msg.count = 2;
      msg.cards = [
        { code: 12345, controller: 0, location: 1, sequence: 0 },
        { code: 0x80000000 | 67890, controller: 0, location: 1, sequence: 1 },
      ];

      const opponentView = msg.opponentView();

      expect(opponentView).not.toBe(msg);
      expect(msg.cards[0].code).toBe(12345);
      expect(msg.cards[1].code).toBe(0x80000000 | 67890);
      expect(opponentView.cards[0].code).toBe(12345);
      expect(opponentView.cards[1].code).toBe(0x80000000 | 67890);
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

    it('should parse concatenated MSG payloads with getInstancesFromPayload', () => {
      const msg1 = new YGOProMsgWin();
      msg1.player = 0;
      msg1.type = 1;
      const msg2 = new YGOProMsgNewTurn();
      msg2.player = 1;

      const b1 = msg1.toPayload();
      const b2 = msg2.toPayload();
      const combined = new Uint8Array(b1.length + b2.length);
      combined.set(b1, 0);
      combined.set(b2, b1.length);

      const parsed = YGOProMessages.getInstancesFromPayload(combined);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toBeInstanceOf(YGOProMsgWin);
      expect(parsed[1]).toBeInstanceOf(YGOProMsgNewTurn);
      expect((parsed[0] as YGOProMsgWin).player).toBe(0);
      expect((parsed[0] as YGOProMsgWin).type).toBe(1);
      expect((parsed[1] as YGOProMsgNewTurn).player).toBe(1);
    });

    it('should stop MSG parsing after one decode error', () => {
      const msg1 = new YGOProMsgWin();
      msg1.player = 0;
      msg1.type = 1;
      const invalidSecond = new Uint8Array([
        OcgcoreCommonConstants.MSG_DAMAGE,
        1,
      ]);

      const b1 = msg1.toPayload();
      const combined = new Uint8Array(b1.length + invalidSecond.length);
      combined.set(b1, 0);
      combined.set(invalidSecond, b1.length);

      const parsed = YGOProMessages.getInstancesFromPayload(combined);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toBeInstanceOf(YGOProMsgWin);
      expect((parsed[0] as YGOProMsgWin).player).toBe(0);
      expect((parsed[0] as YGOProMsgWin).type).toBe(1);
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
