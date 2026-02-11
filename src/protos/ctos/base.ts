import { YGOProProtoBase } from '../../proto-base/ygopro-proto-base';

// CTOS base class only handles the body part
// Format: [length 2 bytes][identifier 1 byte][body]
// This class only deals with [body]
export class YGOProCtosBase extends YGOProProtoBase {
  static messageDirection = 'CTOS';
}
