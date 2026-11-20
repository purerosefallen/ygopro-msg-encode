import {
  YGOProAngelusProcessResult,
  YGOProMsgNewTurn,
  YGOProMsgNewPhase,
  YGOProMsgRetry,
  YGOProMsgSelectYesNo,
  YGOProMsgWin,
} from '../index';

const bytes = (hex: string) =>
  Uint8Array.from(Buffer.from(hex.replace(/\s/g, ''), 'hex'));

describe('Angelus PROCESS_RESULT', () => {
  it('frames one native batch using original message slices', () => {
    const raw = bytes('ff 2800 290400 ff').subarray(1, 6);
    const result = new YGOProAngelusProcessResult().fromOcgcorePayload(raw);
    result.requestId = 8;
    const full = bytes('82 08000000 00 0200 2800 0300 290400');
    expect(result.toFullPayload()).toEqual(full);
    const decoded = new YGOProAngelusProcessResult().fromFullPayload(full);
    const [turn, phase] = decoded.decodeMessages();
    expect(turn).toBeInstanceOf(YGOProMsgNewTurn);
    expect(phase).toBeInstanceOf(YGOProMsgNewPhase);
    (phase as YGOProMsgNewPhase).phase = 42;
    expect(decoded.toFullPayload()).toEqual(full);
    expect(decoded.messages).toEqual([bytes('2800'), bytes('290400')]);
  });

  it('preserves original query padding even when the MSG codec normalizes it', () => {
    const rawCard = bytes('07 00 04 00 0c000000 00000000 aabbccdd');
    const native = Uint8Array.from([...rawCard, 1]);
    const result = new YGOProAngelusProcessResult().fromOcgcorePayload(native);
    expect(result.messages).toEqual([rawCard, bytes('01')]);
    expect(result.status).toBe(3);
    const before = result.toPayload();
    expect(result.decodeMessages()[0].toPayload()).not.toEqual(rawCard);
    expect(result.toPayload()).toEqual(before);

    const oversized = new Uint8Array(65536);
    oversized[0] = 7;
    new DataView(oversized.buffer).setInt32(4, oversized.length - 4, true);
    expect(() => result.fromOcgcorePayload(oversized)).toThrow();
  });

  it('uses the first control message and retains subsequent messages', () => {
    const result = new YGOProAngelusProcessResult();
    for (const [hex, status, type] of [
      ['01050001', 3, YGOProMsgRetry],
      ['05000101', 2, YGOProMsgWin],
      ['0d010100000001', 1, YGOProMsgSelectYesNo],
    ] as const) {
      result.fromOcgcorePayload(bytes(hex));
      expect(result.status).toBe(status);
      expect(result.decodeMessages()[0]).toBeInstanceOf(type);
      expect(result.messages).toHaveLength(2);
    }
    expect(result.fromOcgcorePayload(bytes('01')).toPayload()).toEqual(
      bytes('03 0100 01'),
    );
    expect(result.fromOcgcorePayload(bytes('')).toPayload()).toEqual(
      bytes('00'),
    );
  });

  it('keeps bounded opaque messages until object translation is requested', () => {
    const raw = bytes('00 0200 feff');
    const result = new YGOProAngelusProcessResult().fromPayload(raw);
    expect(result.toPayload()).toEqual(raw);
    const copied = result.copy();
    copied.messages[0][0] = 1;
    expect(result.toPayload()).toEqual(raw);
    expect(copied.messages[0]).toBeInstanceOf(Uint8Array);
    expect(() => result.decodeMessages()).toThrow();
    expect(() =>
      result.fromPayload(bytes('03 0200 0100')).decodeMessages(),
    ).toThrow();
    result.messages = [new Uint8Array(65535)];
    expect(result.toPayload().subarray(1, 3)).toEqual(bytes('ffff'));
    result.messages = [new Uint8Array(65536)];
    expect(() => result.toPayload()).toThrow();
  });

  it('rejects incomplete framing and incomplete or unrecognized native batches', () => {
    const result = new YGOProAngelusProcessResult();
    for (const hex of ['', '04', '00 00', '00 0000', '00 0300 2800']) {
      expect(() => result.fromPayload(bytes(hex))).toThrow();
    }
    result.fromOcgcorePayload(bytes('01'));
    expect(() => result.fromPayload(bytes('00 0200 28'))).toThrow();
    expect(result.toPayload()).toEqual(bytes('03 0100 01'));
    for (const hex of [
      '28',
      '2800ff',
      '280029',
      '060001',
      '07000100 09000100',
    ]) {
      expect(() => result.fromOcgcorePayload(bytes(hex))).toThrow();
      expect(result.toPayload()).toEqual(bytes('03 0100 01'));
    }
  });
});
