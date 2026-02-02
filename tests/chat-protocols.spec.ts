import {
  YGOProCtos,
  YGOProStoc,
  YGOProCtosChat,
  YGOProStocChat,
  YGOProCtosExternalAddress,
} from '../index';

describe('Variable-Length String Protocols', () => {
  describe('CTOS_CHAT', () => {
    it('should serialize and deserialize short message', () => {
      const chat = new YGOProCtosChat();
      chat.msg = 'Hello';

      const body = chat.toPayload();
      expect(body.length).toBe(12); // 5 chars * 2 + 2 bytes null terminator

      // Check null terminator in body
      expect(body[body.length - 2]).toBe(0);
      expect(body[body.length - 1]).toBe(0);

      const fullPayload = chat.toFullPayload();
      expect(fullPayload[2]).toBe(0x16); // Identifier

      const parsed = YGOProCtos.getInstanceFromPayload(
        fullPayload,
      ) as YGOProCtosChat;

      expect(parsed).toBeInstanceOf(YGOProCtosChat);
      expect(parsed.msg).toBe('Hello');
    });

    it('should serialize and deserialize long message', () => {
      const chat = new YGOProCtosChat();
      chat.msg = 'Hello World! This is a test message.';

      const fullPayload = chat.toFullPayload();
      const parsed = YGOProCtos.getInstanceFromPayload(
        fullPayload,
      ) as YGOProCtosChat;

      expect(parsed.msg).toBe(chat.msg);
    });

    it('should handle empty message', () => {
      const chat = new YGOProCtosChat();
      chat.msg = '';

      const body = chat.toPayload();
      expect(body.length).toBe(2); // Only null terminator

      const fullPayload = chat.toFullPayload();
      const parsed = YGOProCtos.getInstanceFromPayload(
        fullPayload,
      ) as YGOProCtosChat;

      expect(parsed.msg).toBe('');
    });

    it('should parse message without null terminator', () => {
      const msg = 'Hi';
      const shortPayload = new Uint8Array(msg.length * 2);
      for (let i = 0; i < msg.length; i++) {
        shortPayload[i * 2] = msg.charCodeAt(i) & 0xff;
        shortPayload[i * 2 + 1] = (msg.charCodeAt(i) >> 8) & 0xff;
      }

      const parsed = new YGOProCtosChat();
      parsed.fromPayload(shortPayload);

      expect(parsed.msg).toBe(msg);
    });
  });

  describe('STOC_CHAT', () => {
    it('should serialize and deserialize with player_type', () => {
      const chat = new YGOProStocChat();
      chat.player_type = 0x0010;
      chat.msg = 'GG!';

      const body = chat.toPayload();
      expect(body.length).toBeGreaterThan(2);

      // Check player_type in body
      const playerType = body[0] | (body[1] << 8);
      expect(playerType).toBe(0x0010);

      // Check null terminator in body
      expect(body[body.length - 2]).toBe(0);
      expect(body[body.length - 1]).toBe(0);

      const fullPayload = chat.toFullPayload();
      expect(fullPayload[2]).toBe(0x19); // Identifier

      const parsed = YGOProStoc.getInstanceFromPayload(
        fullPayload,
      ) as YGOProStocChat;

      expect(parsed).toBeInstanceOf(YGOProStocChat);
      expect(parsed.player_type).toBe(0x0010);
      expect(parsed.msg).toBe('GG!');
    });

    it('should handle different player types', () => {
      const chat = new YGOProStocChat();
      chat.player_type = 0x0007; // Observer
      chat.msg = 'Nice play!';

      const fullPayload = chat.toFullPayload();
      const parsed = YGOProStoc.getInstanceFromPayload(
        fullPayload,
      ) as YGOProStocChat;

      expect(parsed.player_type).toBe(0x0007);
      expect(parsed.msg).toBe('Nice play!');
    });

    it('should handle empty message with player_type', () => {
      const chat = new YGOProStocChat();
      chat.player_type = 0x0001;
      chat.msg = '';

      const body = chat.toPayload();
      expect(body.length).toBe(4); // 2 (player_type) + 2 (null terminator)

      const fullPayload = chat.toFullPayload();
      const parsed = YGOProStoc.getInstanceFromPayload(
        fullPayload,
      ) as YGOProStocChat;

      expect(parsed.player_type).toBe(0x0001);
      expect(parsed.msg).toBe('');
    });
  });

  describe('CTOS_EXTERNAL_ADDRESS', () => {
    it('should serialize and deserialize IPv4 address', () => {
      const ext = new YGOProCtosExternalAddress();
      ext.real_ip = '127.0.0.1';
      ext.hostname = 'example.com';

      const body = ext.toPayload();
      expect(body.length).toBeGreaterThan(4);

      // Check real_ip in body (big endian / network byte order)
      expect(body[0]).toBe(0x7f); // 127
      expect(body[1]).toBe(0x00); // 0
      expect(body[2]).toBe(0x00); // 0
      expect(body[3]).toBe(0x01); // 1

      const fullPayload = ext.toFullPayload();
      expect(fullPayload[2]).toBe(0x17); // Identifier

      const parsed = YGOProCtos.getInstanceFromPayload(
        fullPayload,
      ) as YGOProCtosExternalAddress;

      expect(parsed).toBeInstanceOf(YGOProCtosExternalAddress);
      expect(parsed.real_ip).toBe('127.0.0.1');
      expect(parsed.hostname).toBe('example.com');
    });

    it('should handle IPv6-mapped IPv4 address', () => {
      const ext = new YGOProCtosExternalAddress();
      ext.real_ip = '::ffff:192.168.1.1';
      ext.hostname = 'local.test';

      const body = ext.toPayload();

      // Should be converted to standard IPv4
      expect(body[0]).toBe(0xc0); // 192
      expect(body[1]).toBe(0xa8); // 168
      expect(body[2]).toBe(0x01); // 1
      expect(body[3]).toBe(0x01); // 1

      const parsed = new YGOProCtosExternalAddress();
      parsed.fromPayload(body);

      expect(parsed.real_ip).toBe('192.168.1.1'); // Should be standard IPv4
      expect(parsed.hostname).toBe('local.test');
    });

    it('should handle zero IP address', () => {
      const ext = new YGOProCtosExternalAddress();
      ext.real_ip = '0.0.0.0';
      ext.hostname = 'test';

      const body = ext.toPayload();

      expect(body[0]).toBe(0x00);
      expect(body[1]).toBe(0x00);
      expect(body[2]).toBe(0x00);
      expect(body[3]).toBe(0x00);

      const fullPayload = ext.toFullPayload();
      const parsed = YGOProCtos.getInstanceFromPayload(
        fullPayload,
      ) as YGOProCtosExternalAddress;

      expect(parsed.real_ip).toBe('0.0.0.0');
    });

    it('should handle private network addresses', () => {
      const testCases = [
        { ip: '10.0.0.1', bytes: [0x0a, 0x00, 0x00, 0x01] },
        { ip: '172.16.0.1', bytes: [0xac, 0x10, 0x00, 0x01] },
        { ip: '192.168.1.1', bytes: [0xc0, 0xa8, 0x01, 0x01] },
      ];

      testCases.forEach(({ ip, bytes }) => {
        const ext = new YGOProCtosExternalAddress();
        ext.real_ip = ip;
        ext.hostname = 'test';

        const body = ext.toPayload();

        expect(body[0]).toBe(bytes[0]);
        expect(body[1]).toBe(bytes[1]);
        expect(body[2]).toBe(bytes[2]);
        expect(body[3]).toBe(bytes[3]);

        const fullPayload = ext.toFullPayload();
        const parsed = YGOProCtos.getInstanceFromPayload(
          fullPayload,
        ) as YGOProCtosExternalAddress;

        expect(parsed.real_ip).toBe(ip);
      });
    });

    it('should handle invalid IP address', () => {
      const ext = new YGOProCtosExternalAddress();
      ext.real_ip = 'invalid.ip';
      ext.hostname = 'test';

      const body = ext.toPayload();

      // Invalid IP should be converted to 0.0.0.0
      expect(body[0]).toBe(0x00);
      expect(body[1]).toBe(0x00);
      expect(body[2]).toBe(0x00);
      expect(body[3]).toBe(0x00);
    });

    it('should handle empty hostname', () => {
      const ext = new YGOProCtosExternalAddress();
      ext.real_ip = '127.0.0.1';
      ext.hostname = '';

      const body = ext.toPayload();
      expect(body.length).toBe(6); // 4 (real_ip) + 2 (null terminator)

      const fullPayload = ext.toFullPayload();
      const parsed = YGOProCtos.getInstanceFromPayload(
        fullPayload,
      ) as YGOProCtosExternalAddress;

      expect(parsed.real_ip).toBe('127.0.0.1');
      expect(parsed.hostname).toBe('');
    });
  });

  describe('Bandwidth Optimization', () => {
    it('CTOS_CHAT should use variable length', () => {
      const shortChat = new YGOProCtosChat();
      shortChat.msg = 'Hi';
      const shortBody = shortChat.toPayload();

      const longChat = new YGOProCtosChat();
      longChat.msg = 'This is a much longer message';
      const longBody = longChat.toPayload();

      // Short message should be much smaller
      expect(shortBody.length).toBeLessThan(longBody.length);
      expect(shortBody.length).toBe(6); // 2 chars * 2 + 2 null
      expect(shortBody.length).toBeLessThan(512); // Much smaller than fixed length
    });

    it('STOC_CHAT should use variable length', () => {
      const shortChat = new YGOProStocChat();
      shortChat.player_type = 0;
      shortChat.msg = 'GG';
      const shortBody = shortChat.toPayload();

      const longChat = new YGOProStocChat();
      longChat.player_type = 0;
      longChat.msg = 'Good game! That was really close!';
      const longBody = longChat.toPayload();

      expect(shortBody.length).toBeLessThan(longBody.length);
      expect(shortBody.length).toBe(8); // 2 (player_type) + 2 chars * 2 + 2 null
      expect(shortBody.length).toBeLessThan(514); // Much smaller than fixed length
    });
  });
});
