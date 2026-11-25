import {
  ErrorMessageType,
  GameMode,
  HandResult,
  NetPlayerType,
  RoomStatus,
  TurnPlayerResult,
  YGOProCtosCreateGame,
  YGOProCtosHandResult,
  YGOProCtosKick,
  YGOProCtosTpResult,
  YGOProStocErrorMsg,
  YGOProStocHandResult,
  YGOProStocJoinGame,
  YGOProStocSrvproRoomlist,
} from '../index';

test.each([
  [new YGOProCtosHandResult().fromPartial({ res: HandResult.PAPER }), 'res', 0],
  [
    new YGOProCtosTpResult().fromPartial({ res: TurnPlayerResult.SECOND }),
    'res',
    0,
  ],
  [new YGOProCtosKick().fromPartial({ pos: NetPlayerType.PLAYER1 }), 'pos', 0],
  [
    new YGOProStocHandResult().fromPartial({
      res1: HandResult.ROCK,
      res2: HandResult.PAPER,
    }),
    'res1',
    0,
  ],
  [
    new YGOProStocHandResult().fromPartial({
      res1: HandResult.ROCK,
      res2: HandResult.PAPER,
    }),
    'res2',
    1,
  ],
  [
    new YGOProStocErrorMsg().fromPartial({
      msg: ErrorMessageType.JOINERROR,
      code: 9,
    }),
    'msg',
    0,
  ],
] as const)(
  'validates %p field %s in both directions',
  (msg, field, offset) => {
    const payload = msg.toPayload();
    expect(msg.copy().fromPayload(payload)).toEqual(msg);
    payload[offset] = 0xff;
    expect(() => msg.copy().fromPayload(payload)).toThrow(
      new RegExp(`invalid enum value.*${field}`, 'i'),
    );
    expect(() =>
      Object.assign(msg.copy(), { [field]: 0xff }).toPayload(),
    ).toThrow(new RegExp(`invalid enum value.*${field}`, 'i'));
  },
);

test('checks wire host mode in nested CTOS and STOC host information', () => {
  for (const packet of [new YGOProCtosCreateGame(), new YGOProStocJoinGame()]) {
    Object.assign(packet, { info: { mode: GameMode.TAG } });
    const payload = packet.toPayload();
    expect(packet.copy().fromPayload(payload).info.mode).toBe(GameMode.TAG);
    payload[5] = 0xff;
    expect(() => packet.copy().fromPayload(payload)).toThrow(
      /invalid enum value.*mode/i,
    );
    Object.assign(packet.info, { mode: 0xff });
    expect(() => packet.toPayload()).toThrow(/invalid enum value.*mode/i);
  }
});

test('checks room status in each entry of the nested room list', () => {
  const packet = Object.assign(new YGOProStocSrvproRoomlist(), {
    count: 3,
    rooms: [RoomStatus.WAITING, RoomStatus.DUELING, RoomStatus.SIDING].map(
      (room_status) => ({ room_status }),
    ),
  });
  const payload = packet.toPayload();
  expect(
    packet
      .copy()
      .fromPayload(payload)
      .rooms.map((room) => room.room_status),
  ).toEqual([RoomStatus.WAITING, RoomStatus.DUELING, RoomStatus.SIDING]);
  expect(() =>
    packet
      .copy()
      .fromPayload(
        Uint8Array.from(payload, (value, index) =>
          index === 66 ? 0xff : value,
        ),
      ),
  ).toThrow(/invalid enum value.*room_status/i);
  Object.assign(packet.rooms[1], { room_status: 0xff });
  expect(() => packet.toPayload()).toThrow(/invalid enum value.*room_status/i);
});

test.each([
  [ErrorMessageType.JOINERROR, 9],
  [ErrorMessageType.DECKERROR, 0],
  [ErrorMessageType.DECKERROR, 0x90000007],
  [ErrorMessageType.SIDEERROR, 0],
  [ErrorMessageType.VERERROR, 0x12345678],
])('keeps ERROR_MSG type %i code %i and padding on the wire', (msg, code) => {
  const packet = new YGOProStocErrorMsg().fromPartial({ msg, code });
  const payload = Buffer.from(packet.toPayload());
  expect(payload).toHaveLength(8);
  expect(payload.subarray(1, 4)).toEqual(Buffer.alloc(3));
  expect(payload.readUInt32LE(4)).toBe(code);
  expect(packet.copy().fromPayload(payload)).toEqual(packet);
});
