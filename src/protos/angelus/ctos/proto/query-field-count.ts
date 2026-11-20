import { BinaryField } from '../../../../binary/binary-meta';
import { YGOProAngelusCtosBase } from '../base';
import { checkInteger } from '../../wire';

export class YGOProAngelusQueryFieldCount extends YGOProAngelusCtosBase {
  static identifier = 0x07;

  @BinaryField('u8', 0)
  player = 0;

  @BinaryField('u8', 1)
  location = 0;

  protected validateFields(): void {
    checkInteger(this.player, 0, 1, 'player');
    checkInteger(this.location, 0, 255, 'location');
  }
}
