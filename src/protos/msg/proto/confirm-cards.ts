import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { SEND_TO_ALL, YGOProMsgBase } from '../base';

export class YGOProMsgConfirmCards_CardInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;
}

export class YGOProMsgConfirmCards extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_CONFIRM_CARDS;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  skipPanel: number;

  @BinaryField('u8', 2)
  count: number;

  @BinaryField(() => YGOProMsgConfirmCards_CardInfo, 3, (obj) => obj.count)
  cards: YGOProMsgConfirmCards_CardInfo[];

  getSendTargets(): number[] {
    // 如果卡片在 DECK 位置，只发给 player
    if (this.cards.length > 0 && this.cards[0].location === 0x01) {
      // LOCATION_DECK
      return [this.player];
    }
    // 否则发给所有人
    return SEND_TO_ALL;
  }
}
