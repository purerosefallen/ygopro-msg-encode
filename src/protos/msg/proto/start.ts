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
}
