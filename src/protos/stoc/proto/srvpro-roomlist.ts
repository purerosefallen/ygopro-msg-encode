import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

// STOC_SRVPRO_ROOMLIST - SRVPro room list protocol
// Structure for each room entry
export class SrvproRoomInfo {
  @BinaryField('utf8', 0, 64)
  roomname: string;

  @BinaryField('u8', 64)
  room_status: number;

  @BinaryField('i8', 65)
  room_duel_count: number;

  @BinaryField('i8', 66)
  room_turn_count: number;

  @BinaryField('utf8', 67, 128)
  player1: string;

  @BinaryField('i8', 195)
  player1_score: number;

  @BinaryField('i32', 196)
  player1_lp: number;

  @BinaryField('utf8', 200, 128)
  player2: string;

  @BinaryField('i8', 328)
  player2_score: number;

  @BinaryField('i32', 329)
  player2_lp: number;
}

export class YGOProStocSrvproRoomlist extends YGOProStocBase {
  static identifier = 0x31;

  @BinaryField('u16', 0)
  count: number;

  @BinaryField(() => SrvproRoomInfo, 2, (obj) => obj.count)
  rooms: SrvproRoomInfo[];
}
