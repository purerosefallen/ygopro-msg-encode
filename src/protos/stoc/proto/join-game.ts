import { BinaryField } from '../../../binary/binary-meta';
import { HostInfo } from '../../common';
import { YGOProStocBase } from '../base';

export class YGOProStocJoinGame extends YGOProStocBase {
  static identifier = 0x12;

  @BinaryField(() => HostInfo, 0)
  info: HostInfo;
}
