import { BinaryField } from '../../../binary/binary-meta';
import { PlayerChangeState } from '../../network-enums';
import { YGOProStocBase } from '../base';

/**
 * STOC_HS_PLAYER_CHANGE
 *
 * Notifies clients of player state changes in the host screen (pre-game lobby).
 */
export class YGOProStocHsPlayerChange extends YGOProStocBase {
  static identifier = 0x21;

  /**
   * Composite field: pos<<4 | state
   * - Low 4 bits (0x0F): Player state (PlayerChangeState)
   * - High 4 bits (0xF0): Player position (0-3)
   *
   * Use `playerState` and `playerPosition` getters/setters to access individual components.
   */
  @BinaryField('u8', 0)
  status: number;

  /**
   * Get/Set player state (low 4 bits)
   * Can be a PlayerChangeState enum value or a player position (0-7) for position changes
   */
  get playerState(): number {
    return this.status & 0x0f;
  }

  set playerState(value: number) {
    this.status = (this.status & 0xf0) | (value & 0x0f);
  }

  /**
   * Get/Set player position (high 4 bits, 0-3)
   */
  get playerPosition(): number {
    return (this.status >> 4) & 0x0f;
  }

  set playerPosition(value: number) {
    this.status = (this.status & 0x0f) | ((value & 0x0f) << 4);
  }
}
