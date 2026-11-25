import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';
import { HandResult } from '../../network-enums';

export class YGOProStocHandResult extends YGOProStocBase {
  static identifier = 0x5;

  @BinaryField('u8', 0, undefined, { enum: HandResult })
  res1: number;

  @BinaryField('u8', 1, undefined, { enum: HandResult })
  res2: number;
}
