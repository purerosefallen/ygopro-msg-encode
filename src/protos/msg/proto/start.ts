import { BinaryField } from '../../../binary/binary-meta';
import { YGOProMsgBase } from '../base';

export class YGOProMsgStart_PlayerInfo {
  @BinaryField('u16', 0)
  deckCount: number;

  @BinaryField('u16', 2)
  extraCount: number;
}

export class YGOProMsgStart extends YGOProMsgBase {
  static identifier = 4; // MSG_START

  /**
   * Player type / position (composite field):
   * - Low 4 bits (0x0F): Player number (0=first, 1=second, 2-3 in tag mode)
   * - High 4 bits (0xF0): Observer flag (0x10 = observer)
   * 
   * Use `playerNumber` and `observerFlag` getters/setters to access individual components.
   */
  @BinaryField('u8', 0)
  playerType: number;

  @BinaryField('u8', 1)
  duelRule: number;

  @BinaryField('i32', 2)
  startLp0: number;

  @BinaryField('i32', 6)
  startLp1: number;

  @BinaryField(() => YGOProMsgStart_PlayerInfo, 10)
  player0: YGOProMsgStart_PlayerInfo;

  @BinaryField(() => YGOProMsgStart_PlayerInfo, 14)
  player1: YGOProMsgStart_PlayerInfo;

  /**
   * Get/Set player number (low 4 bits, 0-3)
   */
  get playerNumber(): number {
    return this.playerType & 0x0f;
  }

  set playerNumber(value: number) {
    this.playerType = (this.playerType & 0xf0) | (value & 0x0f);
  }

  /**
   * Get/Set observer flag (high 4 bits, 0x00 or 0x10)
   */
  get observerFlag(): number {
    return this.playerType & 0xf0;
  }

  set observerFlag(value: number) {
    this.playerType = (this.playerType & 0x0f) | (value & 0xf0);
  }
}
