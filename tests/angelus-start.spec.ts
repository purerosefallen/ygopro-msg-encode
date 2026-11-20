import YGOProDeck from 'ygopro-deck-encode';
import { YGOProAngelusStart, YGOProAngelusFinishOk } from '../index';

const bytes = (hex: string) =>
  Uint8Array.from(Buffer.from(hex.replace(/\s/g, ''), 'hex'));
const prefix =
  '01000000 02000000 03000000 04000000 05000000 06000000 07000000 ffffffff ';
const twoDecks = '03 01000000 02000000 01000000 01 80ffffff';
const dump = '0300 0100 e99baa 61 0100 0000 62';

describe('Angelus START and native registry dump', () => {
  it('converts live and replay decks without modifying the cards or seat order', () => {
    const decks = [
      new YGOProDeck({ main: [10, 20, 10, 30], extra: [41, 42], side: [50] }),
      new YGOProDeck({ main: [60], extra: [], side: [70] }),
    ];
    const start = new YGOProAngelusStart();
    expect(start.setDecks(decks)).toBe(start);
    expect(start.decks).toEqual([[10, 20, 10, 30, 41, 42], [60]]);
    expect(start.setReplayDecks(decks)).toBe(start);
    expect(start.decks).toEqual([[30, 10, 20, 10, 42, 41], [60]]);
    expect(
      new YGOProAngelusStart().fromPayload(start.toPayload()).decks,
    ).toEqual(start.decks);
    expect(decks[0].main).toEqual([10, 20, 10, 30]);
    expect(decks[0].extra).toEqual([41, 42]);
    expect(decks[0].side).toEqual([50]);
    decks[1].main.push(61);
    expect(start.decks[1]).toEqual([60]);
  });

  it('preserves the seed, signed LP, interleaving, duplicates and registry bytes', () => {
    const full = bytes(
      '01 01000000 ' + prefix + '05 02 feffffff 06 01 ' + twoDecks + dump,
    );
    const start = new YGOProAngelusStart().fromFullPayload(full);
    expect(start.seed).toEqual([1, 2, 3, 4, 5, 6, 7, 0xffffffff]);
    expect([
      start.duelRule,
      start.flags,
      start.startLp,
      start.startHand,
      start.drawCount,
    ]).toEqual([5, 2, -2, 6, 1]);
    expect(start.decks).toEqual([[1, 2, 1], [0xffffff80]]);
    expect(start.registry).toEqual(bytes(dump));
    expect(start.decodeRegistry()).toEqual({ 雪: 'a', b: '' });
    expect(start.toFullPayload()).toEqual(full);
    start.setRegistry({ 雪: 'a', b: '' });
    expect(start.toFullPayload()).toEqual(full);
  });

  it('handles four distinct tag seats and a 255-card deck', () => {
    const start = new YGOProAngelusStart();
    start.flags = 1;
    start.decks = [[11], [12], [13], [14]];
    expect(start.toPayload().subarray(40)).toEqual(
      bytes('010b000000 010c000000 010d000000 010e000000'),
    );
    start.decks[3] = Array(255).fill(14);
    expect(
      new YGOProAngelusStart().fromPayload(start.toPayload()).decks,
    ).toEqual(start.decks);
    start.decks[3].push(15);
    expect(() => start.toPayload()).toThrow();
  });

  it('validates deck and fixed field boundaries', () => {
    const start = new YGOProAngelusStart();
    for (const tail of ['', '00', '0201000000', '000001000000', '0000ff']) {
      expect(() =>
        start.fromPayload(bytes(prefix + '05 00 401f0000 05 01 ' + tail)),
      ).toThrow();
    }
    expect(() => start.fromPayload(new Uint8Array(39))).toThrow();
    expect(() =>
      start.fromPartial({ decks: [[-1], []] }).toPayload(),
    ).toThrow();
    expect(() =>
      start.fromPartial({ decks: [[], []], flags: 1 }).toPayload(),
    ).toThrow();
    expect(() => start.fromPartial({ seed: [1] }).toPayload()).toThrow();
  });

  it('shares the native dump format between START and FINISH_OK', () => {
    const finish = new YGOProAngelusFinishOk();
    expect(finish.toPayload()).toHaveLength(0);
    expect(finish.setRegistry({ 雪: 'a', b: '' }).toPayload()).toEqual(
      bytes(dump),
    );
    expect(finish.decodeRegistry()).toEqual({ 雪: 'a', b: '' });
    const entries = { ['__proto__']: 'entry', ['\uFEFFkey']: 'a\0b' };
    expect(finish.setRegistry(entries).decodeRegistry()).toEqual(entries);
    const raw = bytes('0100 0200 ff c080');
    finish.fromPayload(raw);
    expect(finish.toPayload()).toEqual(raw);
    expect(() => finish.decodeRegistry()).toThrow();
    expect(finish.toPayload()).toEqual(raw);
    for (const hex of ['01', '000000', '0100 0200 61', '00000000 ff']) {
      expect(() => finish.fromPayload(bytes(hex))).toThrow();
    }
    expect(() => finish.setRegistry({ a: '界'.repeat(21846) })).toThrow();
    finish.setRegistry({ a: '界'.repeat(21845) });
    expect(finish.toPayload().subarray(0, 4)).toEqual(bytes('0100ffff'));
  });
});
