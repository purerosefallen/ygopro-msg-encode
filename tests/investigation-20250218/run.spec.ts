import {
  createOcgcoreWrapper,
  DirCardReader,
  DirScriptReaderEx,
  playYrpStep,
} from 'koishipro-core.js';
import initSqlJs from 'sql.js';
import fs from 'fs/promises';
import path from 'path';
import { OcgcoreScriptConstants } from '../../src/vendor/script-constants';
import { YGOProMessages, YGOProMsgUpdateData } from '../../src/protos';

describe('Investigation 20250218', () => {
  it('should equal message', async () => {
    const SQL = await initSqlJs();
    const ocgcore = await createOcgcoreWrapper();
    ocgcore
      .setScriptReader(await DirScriptReaderEx('./ygopro'))
      .setCardReader(await DirCardReader(SQL, './ygopro'));

    let process = 0;
    for (const data of playYrpStep(
      ocgcore,
      await fs.readFile(path.join(__dirname, 'buggy.yrp')),
    )) {
      console.log('Process', process++);
      const result = data.result;
      let raw = result.raw;
      const messages = YGOProMessages.getInstancesFromPayload(result.raw);
      const totalLength = messages.reduce(
        (sum, msg) => sum + msg.toPayload().length,
        0,
      );
      console.log(
        'Total decoded length',
        totalLength,
        'Original length',
        raw.length,
      );
      expect(totalLength).toBe(raw.length);
      for (const msg of messages || []) {
        const decoded = msg.toPayload();
        const current = raw.slice(0, decoded.length);
        console.log(
          'Current',
          msg.constructor.name,
          'Length',
          decoded.length,
          'Remaining',
          raw.length - decoded.length,
        );
        expect(current).toEqual(decoded);
        raw = raw.slice(decoded.length);
      }
      expect(raw.length).toBe(0);
      for (const location of [
        OcgcoreScriptConstants.LOCATION_HAND,
        OcgcoreScriptConstants.LOCATION_DECK,
        OcgcoreScriptConstants.LOCATION_MZONE,
        OcgcoreScriptConstants.LOCATION_SZONE,
        OcgcoreScriptConstants.LOCATION_GRAVE,
        OcgcoreScriptConstants.LOCATION_REMOVED,
        OcgcoreScriptConstants.LOCATION_EXTRA,
      ]) {
        for (const player of [0, 1]) {
          const queryResult = data.duel.queryFieldCard({
            queryFlag: 0xefffff,
            player,
            location,
            useCache: 0,
          });
          const raw = queryResult.raw;
          const builtPayload = Buffer.alloc(3 + raw.length);
          builtPayload[0] = 6; // MSG_UPDATE_DATA
          builtPayload[1] = player;
          builtPayload[2] = location;
          Buffer.from(raw).copy(builtPayload, 3);
          const updateCard = new YGOProMsgUpdateData()
            .fromPayload(builtPayload)
            .toPayload()
            .slice(3);
          console.log(
            'MSG_UPDATE_DATA',
            'Player',
            player,
            'Location',
            location,
            'Length',
            raw.length,
          );
          expect(raw.length).toBe(updateCard.length);
          expect(raw).toEqual(updateCard);
        }
      }
    }

    ocgcore.finalize();
  });
});
