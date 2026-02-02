import YGOProDeck from 'ygopro-deck-encode';
import { YGOProCtosBase } from '../base';

// CTOS_UPDATE_DECK uses ygopro-deck-encode
export class YGOProCtosUpdateDeck extends YGOProCtosBase {
  static identifier = 0x2;

  deck: YGOProDeck;

  constructor() {
    super();
    this.deck = new YGOProDeck();
  }

  fromPayload(data: Uint8Array): this {
    this.deck = YGOProDeck.fromUpdateDeckPayload(data);
    return this;
  }

  toPayload(): Uint8Array {
    return this.deck.toUpdateDeckPayload();
  }

  fromPartial(data: Partial<this>): this {
    if (data.deck) {
      // Pass deck data to constructor
      this.deck = new YGOProDeck(data.deck);
    }
    return this;
  }

  copy(): this {
    const copied = new (this.constructor as any)();
    copied.deck = new YGOProDeck(this.deck);
    return copied;
  }
}
