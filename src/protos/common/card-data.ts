import { BinaryField } from '../../binary/binary-meta';
import { PayloadBase } from '../../proto-base/payload-base';
import { OcgcoreCommonConstants } from '../../vendor/ocgcore-constants';

// Double name cards (second_code keys from card_data.h)
const SECOND_CODE_CARDS = new Set([
  78734254, // CARD_MARINE_DOLPHIN
  13857930, // CARD_TWINKLE_MOSS
  1784686, // CARD_TIMAEUS
  11082056, // CARD_CRITIAS
  46232525, // CARD_HERMOS
]);

function checkSetcode(setcode: number, value: number): boolean {
  const settype = value & 0x0fff;
  const setsubtype = value & 0xf000;
  return (
    !!setcode &&
    (setcode & 0x0fff) === settype &&
    (setcode & setsubtype) === setsubtype
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

  @BinaryField('u32', 76)
  ruleCode: number;

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

  getOriginalCode(): number {
    return this.alias ? this.alias : this.code;
  }

  getDuelCode(): number {
    return this.ruleCode ? this.ruleCode : this.getOriginalCode();
  }

  /**
   * Check if this card can be declared with the given opcode filter
   * @param opcode Array of opcodes that define the filter expression
   * @returns true if the card can be declared
   */
  isDeclarable(opcode: number[]): boolean {
    if (this.alias) {
      return false;
    }
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
            stack.push(rhs !== 0 ? Math.floor(lhs / rhs) : 0);
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

    if (
      !SECOND_CODE_CARDS.has(this.code) &&
      (this.ruleCode || this.type & OcgcoreCommonConstants.TYPE_TOKEN)
    ) {
      return false;
    }
    return true;
  }
}
