import { PayloadBase } from './payload-base';

export class RegistryBase<C extends typeof PayloadBase> {
  constructor(
    public payloadClass: C,
    private identifierOffset = 0,
    private dataOffset = 0,
  ) {}

  protos = new Map<number, C>();

  register(proto: C) {
    const identifier = proto.identifier;
    this.protos.set(identifier, proto);
  }

  get(identifier: number): C | undefined {
    return this.protos.get(identifier);
  }

  getInstanceFromPayload(data: Uint8Array): InstanceType<C> | undefined {
    const identifier = data[this.identifierOffset];
    const proto = this.get(identifier);
    if (!proto) {
      return undefined;
    }
    return new proto().fromPayload(
      data.slice(this.dataOffset),
    ) as InstanceType<C>;
  }
}
