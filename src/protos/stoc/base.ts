import { YGOProProtoBase } from '../../proto-base/ygopro-proto-base';

// STOC base class only handles the body part
// Format: [length 2 bytes][identifier 1 byte][body]
// This class only deals with [body]
export class YGOProStocBase extends YGOProProtoBase {
  static messageDirection = 'STOC';
}
