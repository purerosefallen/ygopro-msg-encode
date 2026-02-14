import { ProtoRegistryBase } from '../../proto-base/proto-registry-base';
import { YGOProStocBase } from './base';
import {
  YGOProStocGameMsg,
  YGOProStocErrorMsg,
  YGOProStocSelectHand,
  YGOProStocSelectTp,
  YGOProStocHandResult,
  YGOProStocTpResult,
  YGOProStocChangeSide,
  YGOProStocWaitingSide,
  YGOProStocDeckCount,
  YGOProStocCreateGame,
  YGOProStocJoinGame,
  YGOProStocTypeChange,
  YGOProStocLeaveGame,
  YGOProStocDuelStart,
  YGOProStocDuelEnd,
  YGOProStocReplay,
  YGOProStocTimeLimit,
  YGOProStocChat,
  YGOProStocHsPlayerEnter,
  YGOProStocHsPlayerChange,
  YGOProStocHsWatchChange,
  YGOProStocTeammateSurrender,
  YGOProStocFieldFinish,
  YGOProStocSrvproRoomlist,
} from './proto';

export const YGOProStoc = new ProtoRegistryBase(YGOProStocBase);

YGOProStoc.register(YGOProStocGameMsg);
YGOProStoc.register(YGOProStocErrorMsg);
YGOProStoc.register(YGOProStocSelectHand);
YGOProStoc.register(YGOProStocSelectTp);
YGOProStoc.register(YGOProStocHandResult);
YGOProStoc.register(YGOProStocTpResult);
YGOProStoc.register(YGOProStocChangeSide);
YGOProStoc.register(YGOProStocWaitingSide);
YGOProStoc.register(YGOProStocDeckCount);
YGOProStoc.register(YGOProStocCreateGame);
YGOProStoc.register(YGOProStocJoinGame);
YGOProStoc.register(YGOProStocTypeChange);
YGOProStoc.register(YGOProStocLeaveGame);
YGOProStoc.register(YGOProStocDuelStart);
YGOProStoc.register(YGOProStocDuelEnd);
YGOProStoc.register(YGOProStocReplay);
YGOProStoc.register(YGOProStocTimeLimit);
YGOProStoc.register(YGOProStocChat);
YGOProStoc.register(YGOProStocHsPlayerEnter);
YGOProStoc.register(YGOProStocHsPlayerChange);
YGOProStoc.register(YGOProStocHsWatchChange);
YGOProStoc.register(YGOProStocTeammateSurrender);
YGOProStoc.register(YGOProStocFieldFinish);
YGOProStoc.register(YGOProStocSrvproRoomlist);
