import {
  YGOProCtos,
  YGOProStoc,
  YGOProCtosPlayerInfo,
  YGOProCtosHandResult,
  YGOProStocErrorMsg,
  YGOProStocHandResult,
} from '../index';

describe('CTOS/STOC Protocols', () => {
  describe('CTOS_PLAYER_INFO', () => {
    it('should serialize and deserialize correctly', () => {
      const playerInfo = new YGOProCtosPlayerInfo();
      playerInfo.name = 'ABCD';

      const fullPayload = playerInfo.toFullPayload();

      expect(fullPayload.length).toBeGreaterThan(0);
      expect(fullPayload[2]).toBe(0x10); // Identifier

      const parsed = YGOProCtos.getInstanceFromPayload(fullPayload);
      expect(parsed).toBeInstanceOf(YGOProCtosPlayerInfo);
      expect((parsed as YGOProCtosPlayerInfo).name).toBe(playerInfo.name);
    });

    it('should use fromFullPayload correctly', () => {
      const playerInfo = new YGOProCtosPlayerInfo();
      playerInfo.name = 'ABCD';

      const fullPayload = playerInfo.toFullPayload();

      const parsed = new YGOProCtosPlayerInfo();
      parsed.fromFullPayload(fullPayload);

      expect(parsed.name).toBe(playerInfo.name);
    });
  });

  describe('CTOS_HAND_RESULT', () => {
    it('should serialize and deserialize correctly', () => {
      const handResult = new YGOProCtosHandResult();
      handResult.res = 1;

      const fullPayload = handResult.toFullPayload();

      expect(fullPayload.length).toBeGreaterThan(0);
      expect(fullPayload[2]).toBe(0x3); // Identifier

      const parsed = YGOProCtos.getInstanceFromPayload(fullPayload);
      expect(parsed).toBeInstanceOf(YGOProCtosHandResult);
      expect((parsed as YGOProCtosHandResult).res).toBe(1);
    });

    it('should handle different res values', () => {
      const handResult = new YGOProCtosHandResult();
      handResult.res = 2;

      const fullPayload = handResult.toFullPayload();
      const parsed = YGOProCtos.getInstanceFromPayload(fullPayload);

      expect((parsed as YGOProCtosHandResult).res).toBe(2);
    });

    it('should truncate extra data in fromFullPayload', () => {
      const handResult = new YGOProCtosHandResult();
      handResult.res = 1;

      const fullPayload = handResult.toFullPayload();
      // Add extra bytes
      const extendedPayload = new Uint8Array(fullPayload.length + 10);
      extendedPayload.set(fullPayload);
      for (let i = fullPayload.length; i < extendedPayload.length; i++) {
        extendedPayload[i] = 0xff;
      }

      const parsed = new YGOProCtosHandResult();
      parsed.fromFullPayload(extendedPayload);

      expect(parsed.res).toBe(1);
    });

    it('should throw error if data too short', () => {
      const handResult = new YGOProCtosHandResult();
      handResult.res = 1;

      const fullPayload = handResult.toFullPayload();
      // Remove some bytes to make it too short
      const shortPayload = fullPayload.slice(0, fullPayload.length - 1);

      const parsed = new YGOProCtosHandResult();
      expect(() => parsed.fromFullPayload(shortPayload)).toThrow(/too short/i);
    });
  });

  describe('STOC_ERROR_MSG', () => {
    it('should serialize and deserialize correctly', () => {
      const errorMsg = new YGOProStocErrorMsg();
      errorMsg.msg = 2;
      errorMsg.code = 0x12345678;

      const fullPayload = errorMsg.toFullPayload();

      expect(fullPayload.length).toBeGreaterThan(0);
      expect(fullPayload[2]).toBe(0x2); // Identifier

      const parsed = YGOProStoc.getInstanceFromPayload(fullPayload);
      expect(parsed).toBeInstanceOf(YGOProStocErrorMsg);
      expect((parsed as YGOProStocErrorMsg).msg).toBe(2);
      expect((parsed as YGOProStocErrorMsg).code).toBe(0x12345678);
    });

    it('should handle padding correctly', () => {
      const errorMsg = new YGOProStocErrorMsg();
      errorMsg.msg = 1;
      errorMsg.code = 0xffffffff;

      const fullPayload = errorMsg.toFullPayload();
      const parsed = YGOProStoc.getInstanceFromPayload(
        fullPayload,
      ) as YGOProStocErrorMsg;

      expect(parsed.msg).toBe(1);
      expect(parsed.code).toBe(0xffffffff);
    });

    it('should use fromFullPayload correctly', () => {
      const errorMsg = new YGOProStocErrorMsg();
      errorMsg.msg = 3;
      errorMsg.code = 0xabcdef01;

      const fullPayload = errorMsg.toFullPayload();

      const parsed = new YGOProStocErrorMsg();
      parsed.fromFullPayload(fullPayload);

      expect(parsed.msg).toBe(3);
      expect(parsed.code).toBe(0xabcdef01);
    });
  });

  describe('STOC_HAND_RESULT', () => {
    it('should serialize and deserialize correctly', () => {
      const handResult = new YGOProStocHandResult();
      handResult.res1 = 1;
      handResult.res2 = 2;

      const fullPayload = handResult.toFullPayload();

      expect(fullPayload.length).toBeGreaterThan(0);
      expect(fullPayload[2]).toBe(0x5); // Identifier

      const parsed = YGOProStoc.getInstanceFromPayload(fullPayload);
      expect(parsed).toBeInstanceOf(YGOProStocHandResult);
      expect((parsed as YGOProStocHandResult).res1).toBe(1);
      expect((parsed as YGOProStocHandResult).res2).toBe(2);
    });

    it('should throw error on identifier mismatch', () => {
      const handResult = new YGOProStocHandResult();
      handResult.res1 = 1;
      handResult.res2 = 2;

      const fullPayload = handResult.toFullPayload();
      // Change identifier to wrong value
      fullPayload[2] = 0xff;

      const parsed = new YGOProStocHandResult();
      expect(() => parsed.fromFullPayload(fullPayload)).toThrow(
        /identifier mismatch/i,
      );
    });
  });

  describe('Registry', () => {
    it('should correctly identify CTOS protocols', () => {
      const playerInfo = new YGOProCtosPlayerInfo();
      playerInfo.name = '';

      const fullPayload = playerInfo.toFullPayload();
      const parsed = YGOProCtos.getInstanceFromPayload(fullPayload);

      expect(parsed).toBeDefined();
      expect(parsed).toBeInstanceOf(YGOProCtosPlayerInfo);
    });

    it('should correctly identify STOC protocols', () => {
      const errorMsg = new YGOProStocErrorMsg();
      errorMsg.msg = 1;
      errorMsg.code = 0;

      const fullPayload = errorMsg.toFullPayload();
      const parsed = YGOProStoc.getInstanceFromPayload(fullPayload);

      expect(parsed).toBeDefined();
      expect(parsed).toBeInstanceOf(YGOProStocErrorMsg);
    });

    it('should return undefined for unknown protocol', () => {
      const invalidPayload = new Uint8Array([10, 0, 0xff, 1, 2, 3]);
      const parsed = YGOProCtos.getInstanceFromPayload(invalidPayload);

      expect(parsed).toBeUndefined();
    });

    it('should parse concatenated CTOS payloads with getInstancesFromPayload', () => {
      const p1 = new YGOProCtosHandResult();
      p1.res = 1;
      const p2 = new YGOProCtosHandResult();
      p2.res = 2;

      const b1 = p1.toFullPayload();
      const b2 = p2.toFullPayload();
      const combined = new Uint8Array(b1.length + b2.length);
      combined.set(b1, 0);
      combined.set(b2, b1.length);

      const parsed = YGOProCtos.getInstancesFromPayload(combined);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toBeInstanceOf(YGOProCtosHandResult);
      expect(parsed[1]).toBeInstanceOf(YGOProCtosHandResult);
      expect((parsed[0] as YGOProCtosHandResult).res).toBe(1);
      expect((parsed[1] as YGOProCtosHandResult).res).toBe(2);
    });

    it('should stop when remaining CTOS data is shorter than offsets', () => {
      const p1 = new YGOProCtosHandResult();
      p1.res = 1;
      const p2 = new YGOProCtosHandResult();
      p2.res = 2;

      const b1 = p1.toFullPayload();
      const b2 = p2.toFullPayload();
      const combined = new Uint8Array(b1.length + b2.length + 2);
      combined.set(b1, 0);
      combined.set(b2, b1.length);
      combined.set([0xaa, 0xbb], b1.length + b2.length);

      const parsed = YGOProCtos.getInstancesFromPayload(combined);
      expect(parsed).toHaveLength(2);
      expect((parsed[0] as YGOProCtosHandResult).res).toBe(1);
      expect((parsed[1] as YGOProCtosHandResult).res).toBe(2);
    });

    it('should stop after first STOC payload if next one is invalid', () => {
      const p1 = new YGOProStocErrorMsg();
      p1.msg = 2;
      p1.code = 0x1234;
      const p2 = new YGOProStocErrorMsg();
      p2.msg = 3;
      p2.code = 0x5678;

      const b1 = p1.toFullPayload();
      const b2 = p2.toFullPayload().slice(0, 4);
      const combined = new Uint8Array(b1.length + b2.length);
      combined.set(b1, 0);
      combined.set(b2, b1.length);

      const parsed = YGOProStoc.getInstancesFromPayload(combined);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toBeInstanceOf(YGOProStocErrorMsg);
      expect((parsed[0] as YGOProStocErrorMsg).msg).toBe(2);
      expect((parsed[0] as YGOProStocErrorMsg).code).toBe(0x1234);
    });
  });
});
