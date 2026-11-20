import type YGOProDeck from 'ygopro-deck-encode';
import { BinaryField } from '../../../../binary/binary-meta';
import { YGOProAngelusCtosBase } from '../base';
import {
  decodeRegistry,
  encodeRegistry,
  visitRegistry,
} from '../../registry-dump';
import { checkInteger, joinBytes, viewOf } from '../../wire';

export class YGOProAngelusStart extends YGOProAngelusCtosBase {
  static identifier = 0x01;

  @BinaryField('u32', 0, 8)
  seed: number[] = Array(8).fill(0);

  @BinaryField('u8', 32)
  duelRule = 0;

  @BinaryField('u8', 33)
  flags = 0;

  @BinaryField('i32', 34)
  startLp = 0;

  @BinaryField('u8', 38)
  startHand = 0;

  @BinaryField('u8', 39)
  drawCount = 0;

  decks: number[][] = [[], []];
  registry: Uint8Array = new Uint8Array(0);

  private get deckCount() {
    return this.flags & 1 ? 4 : 2;
  }

  /** Supply each player's main and extra cards in live deck order. */
  setDecks(decks: YGOProDeck[]): this {
    this.decks = decks.map(({ main, extra }) => [...main, ...extra]);
    return this;
  }

  /** YRP stores each zone in native insertion order. Keep the seat order. */
  setReplayDecks(decks: YGOProDeck[]): this {
    this.decks = decks.map(({ main, extra }) =>
      main.slice().reverse().concat(extra.slice().reverse()),
    );
    return this;
  }

  protected validateFields(): void {
    if (this.seed.length !== 8) throw new Error('START requires 8 seed words');
    for (const word of this.seed)
      checkInteger(word, 0, 0xffffffff, 'seed word');
    checkInteger(this.duelRule, 0, 255, 'duelRule');
    checkInteger(this.flags, 0, 3, 'flags');
    checkInteger(this.startLp, -0x80000000, 0x7fffffff, 'startLp');
    checkInteger(this.startHand, 0, 255, 'startHand');
    checkInteger(this.drawCount, 0, 255, 'drawCount');
  }

  protected readTail(tail: Uint8Array): void {
    const view = viewOf(tail);
    const decks: number[][] = [];
    let offset = 0;
    for (let player = 0; player < this.deckCount; player++) {
      const count = view.getUint8(offset++);
      const deck: number[] = [];
      for (let i = 0; i < count; i++) {
        deck.push(view.getUint32(offset, true));
        offset += 4;
      }
      decks.push(deck);
    }
    const registry = tail.subarray(offset);
    visitRegistry(registry);
    this.decks = decks;
    this.registry = registry;
  }

  protected writeTail(): Uint8Array {
    if (this.decks.length !== this.deckCount)
      throw new Error('Wrong number of START decks');
    visitRegistry(this.registry);
    const decks = this.decks.map((cards) => {
      checkInteger(cards.length, 0, 255, 'deck count');
      const bytes = new Uint8Array(1 + cards.length * 4);
      const view = viewOf(bytes);
      bytes[0] = cards.length;
      for (const [index, code] of cards.entries()) {
        checkInteger(code, 0, 0xffffffff, 'card code');
        view.setUint32(1 + 4 * index, code, true);
      }
      return bytes;
    });
    return joinBytes([...decks, this.registry]);
  }

  decodeRegistry(): Record<string, string> {
    return decodeRegistry(this.registry);
  }

  setRegistry(entries: Record<string, string>): this {
    this.registry = encodeRegistry(entries);
    return this;
  }
}
