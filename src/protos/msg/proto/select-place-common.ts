import { BinaryField } from '../../../binary/binary-meta';
import { OcgcoreScriptConstants } from '../../../vendor/script-constants';
import { YGOProMsgResponseBase } from '../with-response-base';

export interface SelectablePlace {
  player: number;
  location: number;
  sequence: number;
}

export class YGOProMsgSelectPlaceCommon extends YGOProMsgResponseBase {
  @BinaryField('u8', 0)
  player: number;

  @BinaryField('u8', 1)
  count: number;

  @BinaryField('u32', 2)
  flag: number;

  getSelectablePlaces() {
    const places: SelectablePlace[] = [];
    const mask = this.flag >>> 0;
    let pos = 0;
    for (const player of [this.player, 1 - this.player]) {
      for (const location of [
        OcgcoreScriptConstants.LOCATION_MZONE,
        OcgcoreScriptConstants.LOCATION_SZONE,
      ]) {
        for (let sequence = 0; sequence < 8; sequence++) {
          if (!(mask & ((1 << pos) >>> 0))) {
            places.push({ player, location, sequence });
          }
          ++pos;
        }
      }
    }
    return places;
  }

  responsePlayer() {
    return this.player;
  }

  prepareResponse(
    places: Array<{ player: number; location: number; sequence: number }>,
  ) {
    const buffer = new Uint8Array(places.length * 3);
    places.forEach((place, i) => {
      if (
        (this.flag >>> 0) &
        ((1 <<
          ((place.player === this.player ? 0 : 16) +
            (place.location === OcgcoreScriptConstants.LOCATION_MZONE ? 0 : 8) +
            place.sequence)) >>>
          0)
      ) {
        throw new Error('Selected place is not available');
      }
      buffer[i * 3] = place.player;
      buffer[i * 3 + 1] = place.location;
      buffer[i * 3 + 2] = place.sequence;
    });
    return buffer;
  }
}
