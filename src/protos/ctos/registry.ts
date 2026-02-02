import { RegistryBase } from '../../proto-base/registry-base';
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

// CTOS format: [length 2 bytes][identifier 1 byte][body]
// identifierOffset: 2 (identifier is at byte 2, after the 2-byte length)
// dataOffset: 3 (body starts at byte 3, after length + identifier)
export const YGOProCtos = new RegistryBase(YGOProCtosBase, {
  identifierOffset: 2,
  dataOffset: 3,
});

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
