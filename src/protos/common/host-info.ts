import { BinaryField } from '../../binary/binary-meta';
import { GameMode } from '../network-enums';

// HostInfo structure from network.h
// Size: 20 bytes (with padding)
export class HostInfo {
  @BinaryField('u32', 0)
  lflist: number;

  @BinaryField('u8', 4)
  rule: number; // Rule index (0-5), maps to OT values in UI

  @BinaryField('u8', 5)
  mode: GameMode;

  @BinaryField('u8', 6)
  duel_rule: number;

  @BinaryField('u8', 7)
  no_check_deck: number;

  @BinaryField('u8', 8)
  no_shuffle_deck: number;

  // 3 bytes padding (bytes 9-11)

  @BinaryField('i32', 12)
  start_lp: number;

  @BinaryField('u8', 16)
  start_hand: number;

  @BinaryField('u8', 17)
  draw_count: number;

  @BinaryField('u16', 18)
  time_limit: number;
}
