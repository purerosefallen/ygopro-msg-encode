import { AngelusRegistry } from '../registry-base';
import { YGOProAngelusStocBase } from './base';
import * as packets from './proto';

export const YGOProAngelusStoc = new AngelusRegistry(YGOProAngelusStocBase);

YGOProAngelusStoc.register(packets.YGOProAngelusStartOk);
YGOProAngelusStoc.register(packets.YGOProAngelusProcessResult);
YGOProAngelusStoc.register(packets.YGOProAngelusResponseOk);
YGOProAngelusStoc.register(packets.YGOProAngelusQueryCardResult);
YGOProAngelusStoc.register(packets.YGOProAngelusQueryFieldCardResult);
YGOProAngelusStoc.register(packets.YGOProAngelusQueryFieldInfoResult);
YGOProAngelusStoc.register(packets.YGOProAngelusQueryFieldCountResult);
YGOProAngelusStoc.register(packets.YGOProAngelusFinishOk);
YGOProAngelusStoc.register(packets.YGOProAngelusCoreMessage);
YGOProAngelusStoc.register(packets.YGOProAngelusError);
