import { RegistryBase } from '../../proto-base/registry-base';
import { YGOProAngelusBase } from './base';

export class AngelusRegistry<
  C extends typeof YGOProAngelusBase,
> extends RegistryBase<C> {
  register(Packet: C): void {
    if (!(Packet.prototype instanceof this.payloadClass)) {
      throw new TypeError('Angelus packet belongs to a different direction');
    }
    super.register(Packet);
  }

  getInstanceFromPayload(data: Uint8Array): InstanceType<C> | undefined {
    if (!data.length) throw new Error('Missing Angelus opcode');
    const Packet = this.get(data[0]);
    if (!Packet) return undefined;
    return new Packet().fromFullPayload(data) as InstanceType<C>;
  }

  // A WS application message always contains exactly one packet.
  getInstancesFromPayload(data: Uint8Array): InstanceType<C>[] {
    const packet = this.getInstanceFromPayload(data);
    return packet ? [packet] : [];
  }
}
