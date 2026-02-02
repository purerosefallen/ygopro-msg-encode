import { YGOProStoc, YGOProStocSrvproRoomlist, SrvproRoomInfo } from '../index';

describe('STOC_SRVPRO_ROOMLIST', () => {
  describe('SrvproRoomInfo', () => {
    it('should create room info with correct fields', () => {
      const room = new SrvproRoomInfo();
      room.roomname = 'TestRoom';
      room.room_status = 0;
      room.room_duel_count = 0;
      room.room_turn_count = 0;
      room.player1 = 'Player1';
      room.player1_score = 0;
      room.player1_lp = 0;
      room.player2 = 'Player2';
      room.player2_score = 0;
      room.player2_lp = 0;

      expect(room.roomname).toBe('TestRoom');
      expect(room.room_status).toBe(0);
      expect(room.player1).toBe('Player1');
      expect(room.player2).toBe('Player2');
    });
  });

  describe('YGOProStocSrvproRoomlist', () => {
    it('should serialize empty room list', () => {
      const roomlist = new YGOProStocSrvproRoomlist();
      roomlist.count = 0;
      roomlist.rooms = [];

      const fullPayload = roomlist.toFullPayload();

      expect(fullPayload.length).toBeGreaterThan(0);
      expect(fullPayload[2]).toBe(0x31); // Identifier

      const parsed = YGOProStoc.getInstanceFromPayload(
        fullPayload,
      ) as YGOProStocSrvproRoomlist;

      expect(parsed).toBeInstanceOf(YGOProStocSrvproRoomlist);
      expect(parsed.count).toBe(0);
      expect(parsed.rooms).toHaveLength(0);
    });

    it('should serialize and deserialize room list with waiting room', () => {
      const roomlist = new YGOProStocSrvproRoomlist();
      roomlist.count = 1;

      const room = new SrvproRoomInfo();
      room.roomname = 'WaitingRoom';
      room.room_status = 0; // Waiting
      room.room_duel_count = 0;
      room.room_turn_count = 0;
      room.player1 = 'Alice';
      room.player1_score = 0;
      room.player1_lp = 0;
      room.player2 = 'Bob';
      room.player2_score = 0;
      room.player2_lp = 0;

      roomlist.rooms = [room];

      const fullPayload = roomlist.toFullPayload();
      const parsed = YGOProStoc.getInstanceFromPayload(
        fullPayload,
      ) as YGOProStocSrvproRoomlist;

      expect(parsed).toBeInstanceOf(YGOProStocSrvproRoomlist);
      expect(parsed.count).toBe(1);
      expect(parsed.rooms).toHaveLength(1);
      expect(parsed.rooms[0].roomname).toBe('WaitingRoom');
      expect(parsed.rooms[0].room_status).toBe(0);
      expect(parsed.rooms[0].player1).toBe('Alice');
      expect(parsed.rooms[0].player2).toBe('Bob');
    });

    it('should serialize and deserialize room list with dueling room', () => {
      const roomlist = new YGOProStocSrvproRoomlist();
      roomlist.count = 1;

      const room = new SrvproRoomInfo();
      room.roomname = 'DuelRoom';
      room.room_status = 1; // Dueling
      room.room_duel_count = 1;
      room.room_turn_count = 5;
      room.player1 = 'Player1';
      room.player1_score = 1;
      room.player1_lp = 7000;
      room.player2 = 'Player2';
      room.player2_score = 0;
      room.player2_lp = 5000;

      roomlist.rooms = [room];

      const fullPayload = roomlist.toFullPayload();
      const parsed = YGOProStoc.getInstanceFromPayload(
        fullPayload,
      ) as YGOProStocSrvproRoomlist;

      expect(parsed).toBeInstanceOf(YGOProStocSrvproRoomlist);
      expect(parsed.count).toBe(1);
      expect(parsed.rooms[0].room_status).toBe(1);
      expect(parsed.rooms[0].room_duel_count).toBe(1);
      expect(parsed.rooms[0].room_turn_count).toBe(5);
      expect(parsed.rooms[0].player1_score).toBe(1);
      expect(parsed.rooms[0].player1_lp).toBe(7000);
      expect(parsed.rooms[0].player2_score).toBe(0);
      expect(parsed.rooms[0].player2_lp).toBe(5000);
    });

    it('should serialize and deserialize multiple rooms', () => {
      const roomlist = new YGOProStocSrvproRoomlist();
      roomlist.count = 2;

      const room1 = new SrvproRoomInfo();
      room1.roomname = 'Room1';
      room1.room_status = 0;
      room1.room_duel_count = 0;
      room1.room_turn_count = 0;
      room1.player1 = 'P1';
      room1.player1_score = 0;
      room1.player1_lp = 0;
      room1.player2 = 'P2';
      room1.player2_score = 0;
      room1.player2_lp = 0;

      const room2 = new SrvproRoomInfo();
      room2.roomname = 'Room2';
      room2.room_status = 1;
      room2.room_duel_count = 1;
      room2.room_turn_count = 10;
      room2.player1 = 'P3';
      room2.player1_score = 1;
      room2.player1_lp = 8000;
      room2.player2 = 'P4';
      room2.player2_score = 1;
      room2.player2_lp = 8000;

      roomlist.rooms = [room1, room2];

      const fullPayload = roomlist.toFullPayload();
      const parsed = YGOProStoc.getInstanceFromPayload(
        fullPayload,
      ) as YGOProStocSrvproRoomlist;

      expect(parsed.count).toBe(2);
      expect(parsed.rooms).toHaveLength(2);
      expect(parsed.rooms[0].roomname).toBe('Room1');
      expect(parsed.rooms[1].roomname).toBe('Room2');
      expect(parsed.rooms[1].room_turn_count).toBe(10);
    });

    it('should handle siding status', () => {
      const roomlist = new YGOProStocSrvproRoomlist();
      roomlist.count = 1;

      const room = new SrvproRoomInfo();
      room.roomname = 'SidingRoom';
      room.room_status = 2; // Siding
      room.room_duel_count = 1;
      room.room_turn_count = 0;
      room.player1 = 'Player1';
      room.player1_score = 1;
      room.player1_lp = 0;
      room.player2 = 'Player2';
      room.player2_score = 0;
      room.player2_lp = 0;

      roomlist.rooms = [room];

      const fullPayload = roomlist.toFullPayload();
      const parsed = YGOProStoc.getInstanceFromPayload(
        fullPayload,
      ) as YGOProStocSrvproRoomlist;

      expect(parsed.rooms[0].room_status).toBe(2);
      expect(parsed.rooms[0].room_duel_count).toBe(1);
    });
  });
});
