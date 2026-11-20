import { BinaryField } from '../../../../binary/binary-meta';
import { YGOProAngelusStocBase } from '../base';
import { checkInteger } from '../../wire';

export class YGOProAngelusQueryFieldCountResult extends YGOProAngelusStocBase {
  static identifier = 0x87;

  @BinaryField('u32', 0)
  count = 0;

  protected validateFields(): void {
    checkInteger(this.count, 0, 0xffffffff, 'count');
  }
}
