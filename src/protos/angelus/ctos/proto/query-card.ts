import { BinaryField } from '../../../../binary/binary-meta';
import { YGOProAngelusCtosBase } from '../base';
import { checkInteger } from '../../wire';

export class YGOProAngelusQueryCard extends YGOProAngelusCtosBase {
  static identifier = 0x04;

  @BinaryField('u8', 0)
  player = 0;

  @BinaryField('u8', 1)
  location = 0;

  @BinaryField('u8', 2)
  sequence = 0;

  @BinaryField('u32', 3)
  queryFlag = 0;

  @BinaryField('u8', 7)
  useCache = 0;

  protected validateFields(): void {
    checkInteger(this.player, 0, 1, 'player');
    checkInteger(this.location, 0, 255, 'location');
    checkInteger(this.sequence, 0, 255, 'sequence');
    checkInteger(this.queryFlag, 0, 0xffffffff, 'queryFlag');
    checkInteger(this.useCache, 0, 1, 'useCache');
  }
}
