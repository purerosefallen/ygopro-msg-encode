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

  getInstancesFromPayload(data: Uint8Array): InstanceType<C>[] {
    const instances: InstanceType<C>[] = [];
    const identifierOffset = this.options.identifierOffset ?? 0;
    const dataOffset = this.options.dataOffset ?? 0;
    const minLength = Math.max(identifierOffset + 1, dataOffset);
    let remaining = data;

    while (remaining.length > 0) {
      // 剩余数据不足以读取 identifier/body 起始偏移时停止
      if (remaining.length < minLength) {
        break;
      }

      try {
        const instance = this.getInstanceFromPayload(remaining);
        if (!instance) {
          break;
        }

        const consumed = dataOffset + instance.toPayload().length;
        if (consumed <= 0 || consumed > remaining.length) {
          break;
        }

        instances.push(instance);
        remaining = remaining.slice(consumed);
      } catch {
        break;
      }
    }

    return instances;
  }
}
