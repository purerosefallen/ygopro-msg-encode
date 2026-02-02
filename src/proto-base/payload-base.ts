import { fillBinaryFields, toBinaryFields } from '../binary/fill-binary-fields';

export class PayloadBase {
  static identifier = 0;

  get identifier(): number {
    return (this.constructor as typeof PayloadBase).identifier;
  }

  fromPartial(data: Partial<this>): this {
    const safeData =
      typeof globalThis.structuredClone === 'function'
        ? globalThis.structuredClone(data)
        : JSON.parse(JSON.stringify(data));

    Object.assign(this, safeData);
    return this;
  }

  fromPayload(data: Uint8Array): this {
    fillBinaryFields(this, data);
    return this;
  }

  toPayload() {
    return toBinaryFields(this);
  }

  copy() {
    return Object.assign(new (this.constructor as new () => this)(), this);
  }
}
