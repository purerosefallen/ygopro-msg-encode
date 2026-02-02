import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgRockPaperScissors extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_ROCK_PAPER_SCISSORS;

  @BinaryField('u8', 0)
  player: number;
}
