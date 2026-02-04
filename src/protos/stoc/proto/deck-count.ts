import { BinaryField } from '../../../binary/binary-meta';
import { YGOProStocBase } from '../base';

/**
 * Deck count information for a single player
 */
export class YGOProStocDeckCount_DeckInfo {
  @BinaryField('i16', 0)
  main: number;

  @BinaryField('i16', 2)
  extra: number;

  @BinaryField('i16', 4)
  side: number;
}

/**
 * STOC_DECK_COUNT: int16_t[6]
 *
 * Sent during side deck phase to inform clients of deck counts.
 */
export class YGOProStocDeckCount extends YGOProStocBase {
  static identifier = 0x9;

  @BinaryField(() => YGOProStocDeckCount_DeckInfo, 0)
  player0DeckCount: YGOProStocDeckCount_DeckInfo;

  @BinaryField(() => YGOProStocDeckCount_DeckInfo, 6)
  player1DeckCount: YGOProStocDeckCount_DeckInfo;
}
