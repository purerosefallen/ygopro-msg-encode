import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

/**
 * STOC_TYPE_CHANGE
 * 
 * Informs the client of their player type and host status in the room.
 */
export class YGOProStocTypeChange extends YGOProStocBase {
  static identifier = 0x13;

  /**
   * Composite field:
   * - Low 4 bits (0x0F): Player position (0-7)
   * - High 4 bits (0xF0): Host flag (0x10 = host, 0x00 = not host)
   * 
   * Use `playerPosition` and `isHost` getters/setters to access individual components.
   */
  @BinaryField('u8', 0)
  type: number;

  /**
   * Get/Set player position (low 4 bits, 0-7)
   */
  get playerPosition(): number {
    return this.type & 0x0f;
  }

  set playerPosition(value: number) {
    this.type = (this.type & 0xf0) | (value & 0x0f);
  }

  /**
   * Get/Set host flag (high 4 bits)
   * Returns true if this player is the host
   */
  get isHost(): boolean {
    return ((this.type >> 4) & 0x0f) !== 0;
  }

  set isHost(value: boolean) {
    if (value) {
      this.type = (this.type & 0x0f) | 0x10;
    } else {
      this.type = this.type & 0x0f;
    }
  }
}
