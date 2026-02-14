import { ProtoRegistryBase } from '../../proto-base/proto-registry-base';
import { YGOProCtosBase } from './base';
import {
  YGOProCtosResponse,
  YGOProCtosUpdateDeck,
  YGOProCtosHandResult,
  YGOProCtosTpResult,
  YGOProCtosPlayerInfo,
  YGOProCtosCreateGame,
  YGOProCtosJoinGame,
  YGOProCtosLeaveGame,
  YGOProCtosSurrender,
  YGOProCtosTimeConfirm,
  YGOProCtosChat,
  YGOProCtosExternalAddress,
  YGOProCtosHsToDuelist,
  YGOProCtosHsToObserver,
  YGOProCtosHsReady,
  YGOProCtosHsNotReady,
  YGOProCtosKick,
  YGOProCtosHsStart,
  YGOProCtosRequestField,
} from './proto';

export const YGOProCtos = new ProtoRegistryBase(YGOProCtosBase);

YGOProCtos.register(YGOProCtosResponse);
YGOProCtos.register(YGOProCtosUpdateDeck);
YGOProCtos.register(YGOProCtosHandResult);
YGOProCtos.register(YGOProCtosTpResult);
YGOProCtos.register(YGOProCtosPlayerInfo);
YGOProCtos.register(YGOProCtosCreateGame);
YGOProCtos.register(YGOProCtosJoinGame);
YGOProCtos.register(YGOProCtosLeaveGame);
YGOProCtos.register(YGOProCtosSurrender);
YGOProCtos.register(YGOProCtosTimeConfirm);
YGOProCtos.register(YGOProCtosChat);
YGOProCtos.register(YGOProCtosExternalAddress);
YGOProCtos.register(YGOProCtosHsToDuelist);
YGOProCtos.register(YGOProCtosHsToObserver);
YGOProCtos.register(YGOProCtosHsReady);
YGOProCtos.register(YGOProCtosHsNotReady);
YGOProCtos.register(YGOProCtosKick);
YGOProCtos.register(YGOProCtosHsStart);
YGOProCtos.register(YGOProCtosRequestField);
