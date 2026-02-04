import { BinaryField } from '../../binary/binary-meta';
import { PayloadBase } from '../../proto-base/payload-base';
import { OcgcoreCommonConstants } from '../../vendor/ocgcore-constants';

// Constants from card_data.h
const CARD_ARTWORK_VERSIONS_OFFSET = 20;
const CARD_BLACK_LUSTER_SOLDIER2 = 5405695;

// Double name cards
const CARD_MARINE_DOLPHIN = 78734254;
const CARD_TWINKLE_MOSS = 13857930;

// Helper functions
function checkSetcode(setcode: number, value: number): boolean {
  const settype = value & 0x0fff;
  const setsubtype = value & 0xf000;
  return (
    setcode &&
    (setcode & 0x0fff) === settype &&
    (setcode & setsubtype) === setsubtype
  );
}

function isAlternative(code: number, alias: number): boolean {
  if (code === CARD_BLACK_LUSTER_SOLDIER2) {
    return false;
  }
  return (
    alias &&
    alias < code + CARD_ARTWORK_VERSIONS_OFFSET &&
    code < alias + CARD_ARTWORK_VERSIONS_OFFSET
  );
}

export class CardData extends PayloadBase {
  @BinaryField('u32', 0)
  code: number;

  @BinaryField('u32', 4)
  alias: number;

  @BinaryField('u16', 8, 16)
  setcode: number[];

  @BinaryField('u32', 40)
  type: number;

  @BinaryField('u32', 44)
  level: number;

  @BinaryField('u32', 48)
  attribute: number;

  @BinaryField('u32', 52)
  race: number;

  @BinaryField('i32', 56)
  attack: number;

  @BinaryField('i32', 60)
  defense: number;

  @BinaryField('u32', 64)
  lscale: number;

  @BinaryField('u32', 68)
  rscale: number;

  @BinaryField('u32', 72)
  linkMarker: number;

  /**
   * Check if this card belongs to a specific setcode
   * @param value The setcode value to check against
   * @returns true if the card belongs to the setcode
   */
  isSetCard(value: number): boolean {
    for (const x of this.setcode) {
      if (!x) {
        return false;
      }
      if (checkSetcode(x, value)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the original code of this card (handles alternate artworks)
   * @returns The original card code
   */
  getOriginalCode(): number {
    return isAlternative(this.code, this.alias) ? this.alias : this.code;
  }

  /**
   * Check if this card can be declared with the given opcode filter
   * @param opcode Array of opcodes that define the filter expression
   * @returns true if the card can be declared
   */
  isDeclarable(opcode: number[]): boolean {
    const stack: number[] = [];

    for (const it of opcode) {
      switch (it) {
        case OcgcoreCommonConstants.OPCODE_ADD: {
          if (stack.length >= 2) {
            const rhs = stack.pop()!;
            const lhs = stack.pop()!;
            stack.push(lhs + rhs);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_SUB: {
          if (stack.length >= 2) {
            const rhs = stack.pop()!;
            const lhs = stack.pop()!;
            stack.push(lhs - rhs);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_MUL: {
          if (stack.length >= 2) {
            const rhs = stack.pop()!;
            const lhs = stack.pop()!;
            stack.push(lhs * rhs);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_DIV: {
          if (stack.length >= 2) {
            const rhs = stack.pop()!;
            const lhs = stack.pop()!;
            stack.push(Math.floor(lhs / rhs));
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_AND: {
          if (stack.length >= 2) {
            const rhs = stack.pop()!;
            const lhs = stack.pop()!;
            stack.push(lhs && rhs ? 1 : 0);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_OR: {
          if (stack.length >= 2) {
            const rhs = stack.pop()!;
            const lhs = stack.pop()!;
            stack.push(lhs || rhs ? 1 : 0);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_NEG: {
          if (stack.length >= 1) {
            const val = stack.pop()!;
            stack.push(-val);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_NOT: {
          if (stack.length >= 1) {
            const val = stack.pop()!;
            stack.push(!val ? 1 : 0);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_ISCODE: {
          if (stack.length >= 1) {
            const code = stack.pop()!;
            stack.push(this.code === code ? 1 : 0);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_ISSETCARD: {
          if (stack.length >= 1) {
            const setCode = stack.pop()!;
            const res = this.isSetCard(setCode);
            stack.push(res ? 1 : 0);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_ISTYPE: {
          if (stack.length >= 1) {
            const val = stack.pop()!;
            stack.push(this.type & val ? 1 : 0);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_ISRACE: {
          if (stack.length >= 1) {
            const raceVal = stack.pop()!;
            stack.push(this.race & raceVal ? 1 : 0);
          }
          break;
        }
        case OcgcoreCommonConstants.OPCODE_ISATTRIBUTE: {
          if (stack.length >= 1) {
            const attributeVal = stack.pop()!;
            stack.push(this.attribute & attributeVal ? 1 : 0);
          }
          break;
        }
        default: {
          // Push literal value
          stack.push(it);
          break;
        }
      }
    }

    if (stack.length !== 1 || stack[0] === 0) {
      return false;
    }

    // Additional checks from the original C++ code
    return (
      this.code === CARD_MARINE_DOLPHIN ||
      this.code === CARD_TWINKLE_MOSS ||
      (!this.alias &&
        (this.type &
          (OcgcoreCommonConstants.TYPE_MONSTER |
            OcgcoreCommonConstants.TYPE_TOKEN)) !==
          (OcgcoreCommonConstants.TYPE_MONSTER |
            OcgcoreCommonConstants.TYPE_TOKEN))
    );
  }
}
