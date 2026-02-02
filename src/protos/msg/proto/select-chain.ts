import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreCommonConstants } from '../../../vendor/ocgcore-constants';
import { YGOProMsgBase } from '../base';

export class YGOProMsgSelectChain_ChainInfo {
  @BinaryField('i32', 0)
  code: number;

  @BinaryField('u8', 4)
  controller: number;

  @BinaryField('u8', 5)
  location: number;

  @BinaryField('u8', 6)
  sequence: number;

  @BinaryField('u8', 7)
  subsequence: number;

  @BinaryField('i32', 8)
  desc: number;

  @BinaryField('u8', 12)
  chainCount: number;
}

export class YGOProMsgSelectChain extends YGOProMsgBase {
  static identifier = OcgcoreCommonConstants.MSG_SELECT_CHAIN;

  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('u8', 2)
  specialCount: number;

  @BinaryField('i32', 3)
  hint0: number;

  @BinaryField('i32', 7)
  hint1: number;

  @BinaryField(() => YGOProMsgSelectChain_ChainInfo, 11, (obj) => obj.count)
  chains: YGOProMsgSelectChain_ChainInfo[];
}
