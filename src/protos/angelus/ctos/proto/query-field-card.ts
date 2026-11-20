import { BinaryField } from '../../../../binary/binary-meta';
import { YGOProAngelusCtosBase } from '../base';
import { checkInteger } from '../../wire';

export class YGOProAngelusQueryFieldCard extends YGOProAngelusCtosBase {
  static identifier = 0x05;

  @BinaryField('u8', 0)
  player = 0;

  @BinaryField('u8', 1)
  location = 0;

  @BinaryField('u32', 2)
  queryFlag = 0;

  @BinaryField('u8', 6)
  useCache = 0;

  protected validateFields(): void {
    checkInteger(this.player, 0, 1, 'player');
    checkInteger(this.location, 0, 255, 'location');
    checkInteger(this.queryFlag, 0, 0xffffffff, 'queryFlag');
    checkInteger(this.useCache, 0, 1, 'useCache');
  }
}
