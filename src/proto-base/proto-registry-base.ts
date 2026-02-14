import { RegistryBase } from './registry-base';
import { YGOProProtoBase } from './ygopro-proto-base';

/**
 * Registry for CTOS/STOC style full payloads:
 * [length 2 bytes LE][identifier 1 byte][body]
 */
export class ProtoRegistryBase<C extends typeof YGOProProtoBase> extends RegistryBase<C> {
  constructor(payloadClass: C) {
    super(payloadClass, {
      identifierOffset: 2,
      dataOffset: 3,
    });
  }

  getInstancesFromPayload(data: Uint8Array): InstanceType<C>[] {
    const instances: InstanceType<C>[] = [];
    let offset = 0;

    while (offset + 2 <= data.length) {
      const declaredLength = data[offset] | (data[offset + 1] << 8);
      if (declaredLength <= 0) {
        break;
      }

      // declaredLength includes identifier byte, so total = 2-byte length + declaredLength
      const packetLength = 2 + declaredLength;
      if (offset + packetLength > data.length) {
        break;
      }

      const chunk = data.slice(offset, offset + packetLength);
      const identifier = chunk[2];
      const proto = this.get(identifier);
      if (!proto) {
        break;
      }

      try {
        const instance = new proto().fromFullPayload(chunk) as InstanceType<C>;
        instances.push(instance);
      } catch {
        break;
      }

      offset += packetLength;
    }

    return instances;
  }
}

