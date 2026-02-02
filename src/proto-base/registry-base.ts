import { PayloadBase } from './payload-base';

export class RegistryBase<C extends typeof PayloadBase> {
  constructor(
    public payloadClass: C,
    private options: {
      identifierOffset?: number;
      dataOffset?: number;
    } = {},
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
    const identifier = data[this.options.identifierOffset ?? 0];
    const proto = this.get(identifier);
    if (!proto) {
      return undefined;
    }
    return new proto().fromPayload(
      data.slice(this.options.dataOffset ?? 0),
    ) as InstanceType<C>;
  }
}
