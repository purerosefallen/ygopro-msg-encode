import {
  YGOProAngelusCtos,
  YGOProAngelusCtosBase,
  YGOProAngelusStoc,
  YGOProAngelusStocBase,
  YGOProAngelusBase,
  YGOProAngelusCoreMessage,
  YGOProAngelusCoreMessageType,
  YGOProAngelusError,
  YGOProAngelusQueryCard,
  YGOProAngelusQueryFieldInfoResult,
  YGOProAngelusResponse,
} from '../index';

const bytes = (hex: string) =>
  Uint8Array.from(Buffer.from(hex.replace(/\s/g, ''), 'hex'));

describe('Angelus v1 WS packets', () => {
  // These are independent wire fixtures, including deliberately unaligned u32s.
  const fixtures: [string, string][] = [
    ['Start', '01 78563412 ' + '00'.repeat(40) + '00 00'],
    ['Process', '02 78563412'],
    ['Response', '03 78563412 810023'],
    ['QueryCard', '04 78563412 01 04 03 78563412 01'],
    ['QueryFieldCard', '05 78563412 00 02 ff000080 00'],
    ['QueryFieldInfo', '06 78563412'],
    ['QueryFieldCount', '07 78563412 01 40'],
    ['Finish', '08 78563412'],
    ['StartOk', '81 78563412'],
    ['ProcessResult', '82 78563412 00'],
    ['ResponseOk', '83 78563412'],
    ['QueryCardResult', '84 78563412 1234'],
    ['QueryFieldCardResult', '85 78563412 0007ff'],
    ['QueryFieldInfoResult', '86 78563412 a2ff'],
    ['QueryFieldCountResult', '87 78563412 01000080'],
    ['FinishOk', '88 78563412'],
    ['CoreMessage', '90 00000000 01 e99baa00e58da1'],
    ['Error', 'ff 78563412 0400 74696d656f7574'],
  ];

  it('registers requests and replies in their respective directions', () => {
    expect(YGOProAngelusCtos.protos.size).toBe(8);
    expect(YGOProAngelusStoc.protos.size).toBe(10);
    expect(YGOProAngelusCtos.payloadClass).toBe(YGOProAngelusCtosBase);
    expect(YGOProAngelusStoc.payloadClass).toBe(YGOProAngelusStocBase);
  });

  it('rejects attempts to register a packet with the opposite direction', () => {
    expect(() => {
      // @ts-expect-error A server error cannot be registered as a request.
      YGOProAngelusCtos.register(YGOProAngelusError);
    }).toThrow(TypeError);
    expect(() => {
      // @ts-expect-error A card query cannot be registered as a reply.
      YGOProAngelusStoc.register(YGOProAngelusQueryCard);
    }).toThrow(TypeError);
  });

  it.each(fixtures)('decodes and re-encodes %s', (name, hex) => {
    const full = bytes(hex);
    const padded = new Uint8Array(full.length + 6);
    padded.set(full, 3);
    const request = full[0] < 0x80;
    const [registry, opposite] = request
      ? [YGOProAngelusCtos, YGOProAngelusStoc]
      : [YGOProAngelusStoc, YGOProAngelusCtos];
    const packet = registry.getInstanceFromPayload(
      padded.subarray(3, 3 + full.length),
    )!;
    expect(packet).toBeInstanceOf(YGOProAngelusBase);
    expect(packet).toBeInstanceOf(registry.payloadClass);
    expect(packet).not.toBeInstanceOf(opposite.payloadClass);
    expect(packet.messageDirection).toBe(request ? 'CTOS' : 'STOC');
    expect(opposite.getInstanceFromPayload(full)).toBeUndefined();
    expect(opposite.getInstancesFromPayload(full)).toEqual([]);
    expect(packet.constructor.name).toBe('YGOProAngelus' + name);
    expect(packet.requestId).toBe(name === 'CoreMessage' ? 0 : 0x12345678);
    expect(packet.toPayload()).toEqual(full.subarray(5));
    expect(packet.toFullPayload()).toEqual(full);
    expect(registry.getInstancesFromPayload(full)).toHaveLength(1);
  });

  it('encodes fixed fields from the public properties', () => {
    const query = new YGOProAngelusQueryCard().fromPartial({
      requestId: 0x12345678,
      player: 1,
      location: 4,
      sequence: 3,
      queryFlag: 0x12345678,
      useCache: 1,
    });
    expect(query.toFullPayload()).toEqual(
      bytes('04 78563412 010403 78563412 01'),
    );
    query.location = 256;
    expect(() => query.toPayload()).toThrow();
  });

  it('preserves UTF-8, NUL and BOM in length-delimited text', () => {
    const message = new YGOProAngelusCoreMessage().fromPartial({
      type: YGOProAngelusCoreMessageType.ScriptError,
      message: '\uFEFF雪\0卡',
    });
    const full = bytes('90 00000000 01 efbbbf e99baa 00 e58da1');
    expect(message.toFullPayload()).toEqual(full);
    expect(new YGOProAngelusCoreMessage().fromFullPayload(full).message).toBe(
      message.message,
    );
    const error = new YGOProAngelusError().fromFullPayload(
      bytes('ff 01000000 0300 78'),
    );
    expect([error.code, error.message]).toEqual([3, 'x']);
  });

  it('distinguishes an unknown opcode from a malformed known frame', () => {
    for (const registry of [YGOProAngelusCtos, YGOProAngelusStoc]) {
      expect(
        registry.getInstanceFromPayload(bytes('aa 01000000')),
      ).toBeUndefined();
      expect(() => registry.getInstanceFromPayload(bytes(''))).toThrow();
    }
    for (const hex of [
      '02',
      '02010000',
      '02 00000000',
      '02 01000000 00',
      '04 01000000 00',
      '07 01000000 0201',
      '03 01000000',
      '90 01000000 00',
      '90 00000000 02',
      '90 00000000 00 ff',
      'ff 01000000 0500',
    ]) {
      const full = bytes(hex);
      const registry = full[0] < 0x80 ? YGOProAngelusCtos : YGOProAngelusStoc;
      expect(() => registry.getInstanceFromPayload(full)).toThrow();
    }
    expect(() =>
      new YGOProAngelusQueryCard().fromFullPayload(bytes('05 01000000')),
    ).toThrow();
  });

  it('forwards raw response and query buffers', () => {
    const response = new YGOProAngelusResponse();
    response.response = new Uint8Array(255).fill(0xff);
    expect(response.toPayload()).toHaveLength(255);
    expect(() => response.fromPayload(new Uint8Array(256))).toThrow();
    expect(() => new YGOProAngelusResponse().toPayload()).toThrow();
    const emptyQuery: YGOProAngelusBase =
      new YGOProAngelusQueryFieldInfoResult();
    expect(emptyQuery.toPayload()).toHaveLength(0);
  });
});
