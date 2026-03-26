import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { HandResult } from '../../network-enums';
import { YGOProMsgResponseBase } from '../with-response-base';

export class YGOProMsgRockPaperScissors extends YGOProMsgResponseBase {
  static identifier = OcgcoreCommonConstants.MSG_ROCK_PAPER_SCISSORS;

  @BinaryField('u8', 0)
  player: number;

  responsePlayer(): number {
    return this.player;
  }

  prepareResponse(choice: HandResult) {
    if (choice < HandResult.SCISSORS || choice > HandResult.PAPER) {
      throw new TypeError(
        `Invalid choice: ${choice}. Must be 1 (SCISSORS), 2 (ROCK), or 3 (PAPER)`,
      );
    }
    const buffer = new Uint8Array(1);
    buffer[0] = choice;
    return buffer;
  }
}
