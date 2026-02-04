import { CardData } from '../src/protos/common/card-data';
import { OcgcoreCommonConstants } from '../src/vendor/ocgcore-constants';
import {
  toBinaryFields,
  fillBinaryFields,
} from '../src/binary/fill-binary-fields';

describe('CardData', () => {
  describe('isSetCard', () => {
    it('should return true when card belongs to setcode', () => {
      const card = new CardData();
      card.setcode = [0x1034, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      // Check with exact match
      expect(card.isSetCard(0x1034)).toBe(true);
      // Check with subtype match
      expect(card.isSetCard(0x0034)).toBe(true);
      // Check with different setcode
      expect(card.isSetCard(0x0035)).toBe(false);
    });

    it('should return false when card does not belong to setcode', () => {
      const card = new CardData();
      card.setcode = [0x1034, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      expect(card.isSetCard(0x0046)).toBe(false);
      expect(card.isSetCard(0x2034)).toBe(false);
    });

    it('should return false when setcode array is empty or starts with 0', () => {
      const card = new CardData();
      card.setcode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      expect(card.isSetCard(0x0034)).toBe(false);
    });

    it('should handle multiple setcodes', () => {
      const card = new CardData();
      card.setcode = [0x1034, 0x1046, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      expect(card.isSetCard(0x0034)).toBe(true);
      expect(card.isSetCard(0x0046)).toBe(true);
      expect(card.isSetCard(0x0035)).toBe(false);
    });

    it('should stop at first zero in setcode array', () => {
      const card = new CardData();
      card.setcode = [0x1034, 0, 0x1046, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      expect(card.isSetCard(0x0034)).toBe(true);
      // Should not reach 0x1046 because there's a 0 before it
      expect(card.isSetCard(0x0046)).toBe(false);
    });

    it('should correctly serialize short setcode array with zero fill', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.setcode = [0x1034, 0x1046, 0x2058]; // Only 3 elements instead of 16
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;
      card.level = 4;
      card.attribute = OcgcoreCommonConstants.ATTRIBUTE_LIGHT;
      card.race = OcgcoreCommonConstants.RACE_WARRIOR;
      card.attack = 1000;
      card.defense = 800;
      card.lscale = 0;
      card.rscale = 0;
      card.linkMarker = 0;

      // Convert to binary
      const buffer = toBinaryFields(card);

      // Verify buffer size (should be 76 bytes: CardData structure)
      expect(buffer.length).toBe(76);

      // Create a view to check the setcode area (offset 8, 16 u16 values = 32 bytes)
      const view = new DataView(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength,
      );

      // Check first 3 setcodes are correct
      expect(view.getUint16(8, true)).toBe(0x1034);
      expect(view.getUint16(10, true)).toBe(0x1046);
      expect(view.getUint16(12, true)).toBe(0x2058);

      // Check remaining 13 setcodes are zero-filled
      for (let i = 3; i < 16; i++) {
        expect(view.getUint16(8 + i * 2, true)).toBe(0);
      }

      // Verify isSetCard still works after round-trip
      const card2 = new CardData();
      fillBinaryFields(card2, buffer);

      expect(card2.isSetCard(0x0034)).toBe(true);
      expect(card2.isSetCard(0x0046)).toBe(true);
      expect(card2.isSetCard(0x0058)).toBe(true);
      expect(card2.isSetCard(0x0059)).toBe(false);
    });
  });

  describe('getOriginalCode', () => {
    it('should return code when card is not an alternative artwork', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;

      expect(card.getOriginalCode()).toBe(12345);
    });

    it('should return alias when card is an alternative artwork', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 12340; // Within CARD_ARTWORK_VERSIONS_OFFSET (20)

      expect(card.getOriginalCode()).toBe(12340);
    });

    it('should return code when difference is larger than offset', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 12300; // More than 20 apart

      expect(card.getOriginalCode()).toBe(12345);
    });

    it('should handle Black Luster Soldier special case', () => {
      const card = new CardData();
      card.code = 5405695; // CARD_BLACK_LUSTER_SOLDIER2
      card.alias = 5405690; // Within offset but should be ignored

      expect(card.getOriginalCode()).toBe(5405695); // Should return code, not alias
    });

    it('should return code when alias is 0', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;

      expect(card.getOriginalCode()).toBe(12345);
    });
  });

  describe('isDeclarable', () => {
    it('should return true for Marine Dolphin when opcode evaluates to true', () => {
      const card = new CardData();
      card.code = 78734254; // CARD_MARINE_DOLPHIN
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;

      // Marine Dolphin should be declarable when the opcode condition is true
      const opcodes = [0, OcgcoreCommonConstants.OPCODE_NOT];
      expect(card.isDeclarable(opcodes)).toBe(true); // NOT(0) = 1, and Marine Dolphin always passes

      // But should still return false if the opcode evaluates to false
      const opcodes2 = [0];
      expect(card.isDeclarable(opcodes2)).toBe(false);
    });

    it('should return true for Twinkle Moss regardless of opcode', () => {
      const card = new CardData();
      card.code = 13857930; // CARD_TWINKLE_MOSS
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;

      const opcodes = [1]; // True condition
      expect(card.isDeclarable(opcodes)).toBe(true);
    });

    it('should evaluate OPCODE_ISCODE correctly', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;

      // Check if code is 12345
      const opcodes = [12345, OcgcoreCommonConstants.OPCODE_ISCODE];
      expect(card.isDeclarable(opcodes)).toBe(true);

      // Check if code is 99999 (should fail)
      const opcodes2 = [99999, OcgcoreCommonConstants.OPCODE_ISCODE];
      expect(card.isDeclarable(opcodes2)).toBe(false);
    });

    it('should evaluate OPCODE_ISTYPE correctly', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type =
        OcgcoreCommonConstants.TYPE_MONSTER |
        OcgcoreCommonConstants.TYPE_EFFECT;

      // Check if type is monster
      const opcodes = [
        OcgcoreCommonConstants.TYPE_MONSTER,
        OcgcoreCommonConstants.OPCODE_ISTYPE,
      ];
      expect(card.isDeclarable(opcodes)).toBe(true);

      // Check if type is spell (should fail)
      const opcodes2 = [
        OcgcoreCommonConstants.TYPE_SPELL,
        OcgcoreCommonConstants.OPCODE_ISTYPE,
      ];
      expect(card.isDeclarable(opcodes2)).toBe(false);
    });

    it('should evaluate OPCODE_ISRACE correctly', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;
      card.race = OcgcoreCommonConstants.RACE_WARRIOR;

      const opcodes = [
        OcgcoreCommonConstants.RACE_WARRIOR,
        OcgcoreCommonConstants.OPCODE_ISRACE,
      ];
      expect(card.isDeclarable(opcodes)).toBe(true);

      const opcodes2 = [
        OcgcoreCommonConstants.RACE_DRAGON,
        OcgcoreCommonConstants.OPCODE_ISRACE,
      ];
      expect(card.isDeclarable(opcodes2)).toBe(false);
    });

    it('should evaluate OPCODE_ISATTRIBUTE correctly', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;
      card.attribute = OcgcoreCommonConstants.ATTRIBUTE_LIGHT;

      const opcodes = [
        OcgcoreCommonConstants.ATTRIBUTE_LIGHT,
        OcgcoreCommonConstants.OPCODE_ISATTRIBUTE,
      ];
      expect(card.isDeclarable(opcodes)).toBe(true);

      const opcodes2 = [
        OcgcoreCommonConstants.ATTRIBUTE_DARK,
        OcgcoreCommonConstants.OPCODE_ISATTRIBUTE,
      ];
      expect(card.isDeclarable(opcodes2)).toBe(false);
    });

    it('should evaluate OPCODE_ISSETCARD correctly', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;
      card.setcode = [0x1034, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      const opcodes = [0x0034, OcgcoreCommonConstants.OPCODE_ISSETCARD];
      expect(card.isDeclarable(opcodes)).toBe(true);

      const opcodes2 = [0x0046, OcgcoreCommonConstants.OPCODE_ISSETCARD];
      expect(card.isDeclarable(opcodes2)).toBe(false);
    });

    it('should evaluate arithmetic operations', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;

      // 2 + 3 = 5, check if code is 5 (should fail since code is 12345)
      const opcodes = [
        2,
        3,
        OcgcoreCommonConstants.OPCODE_ADD,
        OcgcoreCommonConstants.OPCODE_ISCODE,
      ];
      expect(card.isDeclarable(opcodes)).toBe(false);

      // Just return 1 (true)
      const opcodes2 = [1];
      expect(card.isDeclarable(opcodes2)).toBe(true);
    });

    it('should evaluate logical operations', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type =
        OcgcoreCommonConstants.TYPE_MONSTER |
        OcgcoreCommonConstants.TYPE_EFFECT;
      card.race = OcgcoreCommonConstants.RACE_WARRIOR;

      // Check if type is monster AND race is warrior
      const opcodes = [
        OcgcoreCommonConstants.TYPE_MONSTER,
        OcgcoreCommonConstants.OPCODE_ISTYPE,
        OcgcoreCommonConstants.RACE_WARRIOR,
        OcgcoreCommonConstants.OPCODE_ISRACE,
        OcgcoreCommonConstants.OPCODE_AND,
      ];
      expect(card.isDeclarable(opcodes)).toBe(true);

      // Check if type is spell OR race is warrior (should be true because race is warrior)
      const opcodes2 = [
        OcgcoreCommonConstants.TYPE_SPELL,
        OcgcoreCommonConstants.OPCODE_ISTYPE,
        OcgcoreCommonConstants.RACE_WARRIOR,
        OcgcoreCommonConstants.OPCODE_ISRACE,
        OcgcoreCommonConstants.OPCODE_OR,
      ];
      expect(card.isDeclarable(opcodes2)).toBe(true);
    });

    it('should evaluate NOT operation', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;

      // NOT(type is spell) should be true
      const opcodes = [
        OcgcoreCommonConstants.TYPE_SPELL,
        OcgcoreCommonConstants.OPCODE_ISTYPE,
        OcgcoreCommonConstants.OPCODE_NOT,
      ];
      expect(card.isDeclarable(opcodes)).toBe(true);
    });

    it('should reject tokens with alias', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 54321; // Has alias
      card.type =
        OcgcoreCommonConstants.TYPE_MONSTER | OcgcoreCommonConstants.TYPE_TOKEN;

      const opcodes = [1]; // True condition
      expect(card.isDeclarable(opcodes)).toBe(false);
    });

    it('should accept non-token monsters without alias', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0; // No alias
      card.type =
        OcgcoreCommonConstants.TYPE_MONSTER |
        OcgcoreCommonConstants.TYPE_EFFECT;

      const opcodes = [1]; // True condition
      expect(card.isDeclarable(opcodes)).toBe(true);
    });

    it('should return false when stack is empty', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;

      const opcodes: number[] = []; // Empty opcode array
      expect(card.isDeclarable(opcodes)).toBe(false);
    });

    it('should return false when final result is 0', () => {
      const card = new CardData();
      card.code = 12345;
      card.alias = 0;
      card.type = OcgcoreCommonConstants.TYPE_MONSTER;

      const opcodes = [0]; // Evaluates to 0 (false)
      expect(card.isDeclarable(opcodes)).toBe(false);
    });
  });
});
