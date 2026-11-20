import { AngelusRegistry } from '../registry-base';
import { YGOProAngelusCtosBase } from './base';
import * as packets from './proto';

export const YGOProAngelusCtos = new AngelusRegistry(YGOProAngelusCtosBase);

YGOProAngelusCtos.register(packets.YGOProAngelusStart);
YGOProAngelusCtos.register(packets.YGOProAngelusProcess);
YGOProAngelusCtos.register(packets.YGOProAngelusResponse);
YGOProAngelusCtos.register(packets.YGOProAngelusQueryCard);
YGOProAngelusCtos.register(packets.YGOProAngelusQueryFieldCard);
YGOProAngelusCtos.register(packets.YGOProAngelusQueryFieldInfo);
YGOProAngelusCtos.register(packets.YGOProAngelusQueryFieldCount);
YGOProAngelusCtos.register(packets.YGOProAngelusFinish);
