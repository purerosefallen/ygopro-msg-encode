import { BinaryField } from '../src/binary/binary-meta';
import {
  fillBinaryFields,
  toBinaryFields,
} from '../src/binary/fill-binary-fields';

describe('Binary Serialization', () => {
  describe('Basic numeric types', () => {
    class NumericTypes {
      @BinaryField('u8', 0)
      byte: number;

      @BinaryField('i8', 1)
      signedByte: number;

      @BinaryField('u16', 2)
      word: number;

      @BinaryField('i16', 4)
      signedWord: number;

      @BinaryField('u32', 6)
      dword: number;

      @BinaryField('i32', 10)
      signedDword: number;
    }

    it('should encode numeric types correctly', () => {
      const obj = new NumericTypes();
      obj.byte = 255;
      obj.signedByte = -128;
      obj.word = 65535;
      obj.signedWord = -32768;
      obj.dword = 0xffffffff;
      obj.signedDword = -2147483648;

      const data = toBinaryFields(obj);

      expect(data.length).toBe(14);
      expect(data[0]).toBe(255); // u8
      expect(data[1]).toBe(128); // i8 as unsigned: -128 -> 0x80
      expect(data[2]).toBe(0xff); // u16 low byte
      expect(data[3]).toBe(0xff); // u16 high byte
      expect(data[4]).toBe(0x00); // i16 low byte
      expect(data[5]).toBe(0x80); // i16 high byte
      expect(data[6]).toBe(0xff); // u32 byte 0
      expect(data[7]).toBe(0xff); // u32 byte 1
      expect(data[8]).toBe(0xff); // u32 byte 2
      expect(data[9]).toBe(0xff); // u32 byte 3
      expect(data[10]).toBe(0x00); // i32 byte 0
      expect(data[11]).toBe(0x00); // i32 byte 1
      expect(data[12]).toBe(0x00); // i32 byte 2
      expect(data[13]).toBe(0x80); // i32 byte 3
    });

    it('should decode numeric types correctly', () => {
      const data = new Uint8Array([
        255, // u8
        128, // i8: 0x80 = -128
        0xff,
        0xff, // u16: 65535
        0x00,
        0x80, // i16: 0x8000 = -32768
        0xff,
        0xff,
        0xff,
        0xff, // u32: 0xffffffff
        0x00,
        0x00,
        0x00,
        0x80, // i32: 0x80000000 = -2147483648
      ]);

      const obj = new NumericTypes();
      const size = fillBinaryFields(obj, data);

      expect(size).toBe(14);
      expect(obj.byte).toBe(255);
      expect(obj.signedByte).toBe(-128);
      expect(obj.word).toBe(65535);
      expect(obj.signedWord).toBe(-32768);
      expect(obj.dword).toBe(0xffffffff);
      expect(obj.signedDword).toBe(-2147483648);
    });

    it('should encode and decode round-trip', () => {
      const original = new NumericTypes();
      original.byte = 42;
      original.signedByte = -10;
      original.word = 1234;
      original.signedWord = -5678;
      original.dword = 123456789;
      original.signedDword = -987654321;

      const data = toBinaryFields(original);
      const decoded = new NumericTypes();
      fillBinaryFields(decoded, data);

      expect(decoded.byte).toBe(original.byte);
      expect(decoded.signedByte).toBe(original.signedByte);
      expect(decoded.word).toBe(original.word);
      expect(decoded.signedWord).toBe(original.signedWord);
      expect(decoded.dword).toBe(original.dword);
      expect(decoded.signedDword).toBe(original.signedDword);
    });
  });

  describe('Numeric arrays', () => {
    class NumericArrays {
      @BinaryField('u8', 0, 4)
      bytes: number[];

      @BinaryField('u16', 4, 3)
      words: number[];
    }

    it('should encode numeric arrays correctly', () => {
      const obj = new NumericArrays();
      obj.bytes = [10, 20, 30, 40];
      obj.words = [100, 200, 300];

      const data = toBinaryFields(obj);

      expect(data.length).toBe(10);
      expect(Array.from(data.slice(0, 4))).toEqual([10, 20, 30, 40]);
      // words are u16 little-endian
      expect(data[4]).toBe(100);
      expect(data[5]).toBe(0);
      expect(data[6]).toBe(200);
      expect(data[7]).toBe(0);
      expect(data[8]).toBe(44); // 300 & 0xff
      expect(data[9]).toBe(1); // 300 >> 8
    });

    it('should decode numeric arrays correctly', () => {
      const data = new Uint8Array([
        10,
        20,
        30,
        40,
        100,
        0,
        200,
        0,
        44,
        1, // 300 in little-endian
      ]);

      const obj = new NumericArrays();
      fillBinaryFields(obj, data);

      expect(obj.bytes).toEqual([10, 20, 30, 40]);
      expect(obj.words).toEqual([100, 200, 300]);
    });

    it('should handle partial arrays', () => {
      const obj = new NumericArrays();
      obj.bytes = [1, 2]; // Only 2 elements instead of 4
      obj.words = [10];

      const data = toBinaryFields(obj);

      expect(data[0]).toBe(1);
      expect(data[1]).toBe(2);
      expect(data[2]).toBe(0); // Unfilled elements are 0
      expect(data[3]).toBe(0);
      expect(data[4]).toBe(10);
      expect(data[5]).toBe(0);
      expect(data[6]).toBe(0);
      expect(data[7]).toBe(0);
    });
  });

  describe('UTF-8 strings', () => {
    class Utf8String {
      @BinaryField('utf8', 0, 16)
      name: string;

      @BinaryField('utf8', 16, 8)
      shortName: string;
    }

    it('should encode UTF-8 strings correctly', () => {
      const obj = new Utf8String();
      obj.name = 'Hello World';
      obj.shortName = 'Test';

      const data = toBinaryFields(obj);

      expect(data.length).toBe(24);
      const decoder = new TextDecoder('utf-8');
      const nameBytes = data.slice(0, 16);
      const shortNameBytes = data.slice(16, 24);

      // Find null terminator
      const nameNullIndex = nameBytes.indexOf(0);
      const decodedName = decoder.decode(nameBytes.slice(0, nameNullIndex));
      expect(decodedName).toBe('Hello World');

      const shortNullIndex = shortNameBytes.indexOf(0);
      const decodedShort = decoder.decode(
        shortNameBytes.slice(0, shortNullIndex),
      );
      expect(decodedShort).toBe('Test');
    });

    it('should decode UTF-8 strings correctly', () => {
      const encoder = new TextEncoder();
      const data = new Uint8Array(24);
      const nameBytes = encoder.encode('Hello World');
      const shortBytes = encoder.encode('Test');

      data.set(nameBytes, 0);
      data.set(shortBytes, 16);

      const obj = new Utf8String();
      fillBinaryFields(obj, data);

      expect(obj.name).toBe('Hello World');
      expect(obj.shortName).toBe('Test');
    });

    it('should handle null-terminated strings', () => {
      const data = new Uint8Array(24);
      const encoder = new TextEncoder();
      const testBytes = encoder.encode('ABC');
      data.set(testBytes, 0);
      data[3] = 0; // Null terminator
      data.set(encoder.encode('XYZ'), 4); // More data after null

      const obj = new Utf8String();
      fillBinaryFields(obj, data);

      expect(obj.name).toBe('ABC'); // Should stop at null
    });

    it('should truncate long strings', () => {
      const obj = new Utf8String();
      obj.name = 'This is a very long string that exceeds 16 bytes';
      obj.shortName = 'Short';

      const data = toBinaryFields(obj);
      const decoded = new Utf8String();
      fillBinaryFields(decoded, data);

      // String should be truncated to fit in 16 bytes
      expect(decoded.name.length).toBeLessThanOrEqual(16);
    });

    it('should handle empty strings', () => {
      const obj = new Utf8String();
      obj.name = '';
      obj.shortName = '';

      const data = toBinaryFields(obj);

      expect(data[0]).toBe(0);
      expect(data[16]).toBe(0);

      const decoded = new Utf8String();
      fillBinaryFields(decoded, data);

      expect(decoded.name).toBe('');
      expect(decoded.shortName).toBe('');
    });
  });

  describe('UTF-16 strings', () => {
    class Utf16String {
      @BinaryField('utf16', 0, 10) // 10 characters = 20 bytes
      name: string;
    }

    it('should encode UTF-16 strings correctly', () => {
      const obj = new Utf16String();
      obj.name = 'Hello';

      const data = toBinaryFields(obj);

      expect(data.length).toBe(20); // 10 characters = 20 bytes
      // UTF-16LE encoding
      expect(data[0]).toBe('H'.charCodeAt(0));
      expect(data[1]).toBe(0);
      expect(data[2]).toBe('e'.charCodeAt(0));
      expect(data[3]).toBe(0);
      expect(data[4]).toBe('l'.charCodeAt(0));
      expect(data[5]).toBe(0);
      expect(data[6]).toBe('l'.charCodeAt(0));
      expect(data[7]).toBe(0);
      expect(data[8]).toBe('o'.charCodeAt(0));
      expect(data[9]).toBe(0);
      expect(data[10]).toBe(0); // Rest should be null
      expect(data[11]).toBe(0);
    });

    it('should decode UTF-16 strings correctly', () => {
      const data = new Uint8Array(20); // 10 characters = 20 bytes
      const view = new DataView(data.buffer);
      const text = 'Test';
      for (let i = 0; i < text.length; i++) {
        view.setUint16(i * 2, text.charCodeAt(i), true); // little-endian
      }

      const obj = new Utf16String();
      fillBinaryFields(obj, data);

      expect(obj.name).toBe('Test');
    });

    it('should handle null-terminated UTF-16 strings', () => {
      const data = new Uint8Array(20); // 10 characters = 20 bytes
      const view = new DataView(data.buffer);
      view.setUint16(0, 'A'.charCodeAt(0), true);
      view.setUint16(2, 'B'.charCodeAt(0), true);
      view.setUint16(4, 0, true); // Null terminator
      view.setUint16(6, 'C'.charCodeAt(0), true); // More data after null

      const obj = new Utf16String();
      fillBinaryFields(obj, data);

      expect(obj.name).toBe('AB'); // Should stop at null
    });
  });

  describe('Nested objects', () => {
    class InnerObject {
      @BinaryField('u8', 0)
      id: number;

      @BinaryField('u16', 1)
      value: number;
    }

    class OuterObject {
      @BinaryField('u8', 0)
      header: number;

      @BinaryField(() => InnerObject, 1)
      inner: InnerObject;

      @BinaryField('u8', 4)
      footer: number;
    }

    it('should encode nested objects correctly', () => {
      const obj = new OuterObject();
      obj.header = 0xaa;
      obj.inner = new InnerObject();
      obj.inner.id = 0x42;
      obj.inner.value = 0x1234;
      obj.footer = 0xbb;

      const data = toBinaryFields(obj);

      expect(data.length).toBe(5);
      expect(data[0]).toBe(0xaa); // header
      expect(data[1]).toBe(0x42); // inner.id
      expect(data[2]).toBe(0x34); // inner.value low
      expect(data[3]).toBe(0x12); // inner.value high
      expect(data[4]).toBe(0xbb); // footer
    });

    it('should decode nested objects correctly', () => {
      const data = new Uint8Array([0xaa, 0x42, 0x34, 0x12, 0xbb]);

      const obj = new OuterObject();
      const size = fillBinaryFields(obj, data);

      expect(size).toBe(5);
      expect(obj.header).toBe(0xaa);
      expect(obj.inner).toBeDefined();
      expect(obj.inner.id).toBe(0x42);
      expect(obj.inner.value).toBe(0x1234);
      expect(obj.footer).toBe(0xbb);
    });

    it('should round-trip nested objects', () => {
      const original = new OuterObject();
      original.header = 123;
      original.inner = new InnerObject();
      original.inner.id = 45;
      original.inner.value = 6789;
      original.footer = 210;

      const data = toBinaryFields(original);
      const decoded = new OuterObject();
      fillBinaryFields(decoded, data);

      expect(decoded.header).toBe(original.header);
      expect(decoded.inner.id).toBe(original.inner.id);
      expect(decoded.inner.value).toBe(original.inner.value);
      expect(decoded.footer).toBe(original.footer);
    });
  });

  describe('Object arrays', () => {
    class Item {
      @BinaryField('u8', 0)
      id: number;

      @BinaryField('u16', 1)
      value: number;
    }

    class Container {
      @BinaryField('u8', 0)
      count: number;

      @BinaryField(() => Item, 1, 3)
      items: Item[];
    }

    it('should support literal objects with useClass parameter', () => {
      const obj = {
        count: 3,
        items: [
          { id: 1, value: 100 },
          { id: 2, value: 200 },
          { id: 3, value: 300 },
        ],
      };

      const data = toBinaryFields(obj, Container);

      expect(data.length).toBe(10);
      expect(data[0]).toBe(3);
      expect(data[1]).toBe(1);
      expect(data[2]).toBe(100);

      // Decode with useClass
      const decoded = {} as Container;
      fillBinaryFields(decoded, data, Container);

      expect(decoded.count).toBe(3);
      expect(decoded.items.length).toBe(3);
      expect(decoded.items[0].id).toBe(1);
      expect(decoded.items[0].value).toBe(100);
    });

    it('should encode object arrays correctly', () => {
      const obj = new Container();
      obj.count = 3;

      const item1 = new Item();
      item1.id = 1;
      item1.value = 100;

      const item2 = new Item();
      item2.id = 2;
      item2.value = 200;

      const item3 = new Item();
      item3.id = 3;
      item3.value = 300;

      obj.items = [item1, item2, item3];

      const data = toBinaryFields(obj);

      expect(data.length).toBe(10); // 1 + 3*(1+2)
      expect(data[0]).toBe(3); // count
      // Item 1
      expect(data[1]).toBe(1);
      expect(data[2]).toBe(100);
      expect(data[3]).toBe(0);
      // Item 2
      expect(data[4]).toBe(2);
      expect(data[5]).toBe(200);
      expect(data[6]).toBe(0);
      // Item 3
      expect(data[7]).toBe(3);
      expect(data[8]).toBe(44); // 300 & 0xff
      expect(data[9]).toBe(1); // 300 >> 8
    });

    it('should decode object arrays correctly', () => {
      const data = new Uint8Array([
        3, // count
        1,
        100,
        0, // item 1
        2,
        200,
        0, // item 2
        3,
        44,
        1, // item 3
      ]);

      const obj = new Container();
      fillBinaryFields(obj, data);

      expect(obj.count).toBe(3);
      expect(obj.items.length).toBe(3);
      expect(obj.items[0].id).toBe(1);
      expect(obj.items[0].value).toBe(100);
      expect(obj.items[1].id).toBe(2);
      expect(obj.items[1].value).toBe(200);
      expect(obj.items[2].id).toBe(3);
      expect(obj.items[2].value).toBe(300);
    });
  });

  describe('Dynamic offsets and lengths', () => {
    class DynamicFields {
      @BinaryField('u8', 0)
      headerSize: number;

      @BinaryField('u8', (obj) => obj.headerSize)
      dataStart: number;

      @BinaryField('u8', (obj) => obj.headerSize + 1, (obj) => obj.dataStart)
      dynamicArray: number[];
    }

    it('should handle dynamic offsets', () => {
      const obj = new DynamicFields();
      obj.headerSize = 5;
      obj.dataStart = 3;
      obj.dynamicArray = [10, 20, 30];

      const data = toBinaryFields(obj);

      expect(data[0]).toBe(5); // headerSize
      expect(data[5]).toBe(3); // dataStart at offset 5
      expect(data[6]).toBe(10); // array at offset 6
      expect(data[7]).toBe(20);
      expect(data[8]).toBe(30);
    });

    it('should decode dynamic offsets', () => {
      const data = new Uint8Array(20);
      data[0] = 5;
      data[5] = 3;
      data[6] = 10;
      data[7] = 20;
      data[8] = 30;

      const obj = new DynamicFields();
      fillBinaryFields(obj, data);

      expect(obj.headerSize).toBe(5);
      expect(obj.dataStart).toBe(3);
      expect(obj.dynamicArray).toEqual([10, 20, 30]);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty objects', () => {
      class EmptyClass {}

      const obj = new EmptyClass();
      const data = toBinaryFields(obj);

      expect(data.length).toBe(0);
    });

    it('should return empty array for objects without metadata', () => {
      class NoMetadata {
        someField: number;
        anotherField: string;
      }

      const obj = new NoMetadata();
      obj.someField = 42;
      obj.anotherField = 'test';

      const data = toBinaryFields(obj);
      expect(data.length).toBe(0);

      // Also test with literal object using useClass
      const literal = { someField: 100, anotherField: 'hello' };
      const data2 = toBinaryFields(literal, NoMetadata);
      expect(data2.length).toBe(0);
    });

    it('should handle zero values', () => {
      class ZeroValues {
        @BinaryField('u8', 0)
        zero: number;

        @BinaryField('i32', 1)
        negativeZero: number;
      }

      const obj = new ZeroValues();
      obj.zero = 0;
      obj.negativeZero = 0;

      const data = toBinaryFields(obj);
      const decoded = new ZeroValues();
      fillBinaryFields(decoded, data);

      expect(decoded.zero).toBe(0);
      expect(decoded.negativeZero).toBe(0);
    });

    it('should handle undefined fields gracefully', () => {
      class OptionalFields {
        @BinaryField('u8', 0)
        defined: number;

        @BinaryField('u8', 1)
        undefined?: number;
      }

      const obj = new OptionalFields();
      obj.defined = 42;
      // undefined is not set

      const data = toBinaryFields(obj);

      expect(data[0]).toBe(42);
      expect(data[1]).toBe(0); // Should be 0 for undefined
    });

    it('should throw error when data is too short', () => {
      class RequiresTenBytes {
        @BinaryField('u8', 0)
        byte1: number;

        @BinaryField('u32', 1)
        dword: number;

        @BinaryField('u8', 5)
        byte2: number;
      }

      const shortData = new Uint8Array([1, 2, 3]); // Only 3 bytes, needs 6

      const obj = new RequiresTenBytes();
      expect(() => fillBinaryFields(obj, shortData)).toThrow('Data too short');
    });

    it('should throw error when string data is too short', () => {
      class RequiresString {
        @BinaryField('utf8', 0, 20)
        name: string;
      }

      const shortData = new Uint8Array([1, 2, 3]); // Only 3 bytes, needs 20

      const obj = new RequiresString();
      expect(() => fillBinaryFields(obj, shortData)).toThrow('Data too short');
    });

    it('should throw error when object array data is too short', () => {
      class Item {
        @BinaryField('u8', 0)
        id: number;

        @BinaryField('u16', 1)
        value: number;
      }

      class Container {
        @BinaryField(() => Item, 0, 3)
        items: Item[];
      }

      const shortData = new Uint8Array([1, 2, 3]); // Only 3 bytes, needs 3*3=9

      const obj = new Container();
      expect(() => fillBinaryFields(obj, shortData)).toThrow('Data too short');
    });
  });

  describe('Complex integration test', () => {
    class Address {
      @BinaryField('u8', 0)
      street: number;

      @BinaryField('u16', 1)
      zip: number;
    }

    class Person {
      @BinaryField('u8', 0)
      age: number;

      @BinaryField('utf8', 1, 20)
      name: string;

      @BinaryField(() => Address, 21)
      address: Address;

      @BinaryField('u8', 24, 3)
      scores: number[];
    }

    it('should handle complex nested structure', () => {
      const person = new Person();
      person.age = 30;
      person.name = 'John Doe';
      person.address = new Address();
      person.address.street = 123;
      person.address.zip = 12345;
      person.scores = [85, 90, 95];

      const data = toBinaryFields(person);

      // Decode and verify
      const decoded = new Person();
      fillBinaryFields(decoded, data);

      expect(decoded.age).toBe(30);
      expect(decoded.name).toBe('John Doe');
      expect(decoded.address.street).toBe(123);
      expect(decoded.address.zip).toBe(12345);
      expect(decoded.scores).toEqual([85, 90, 95]);

      // Verify byte-level data
      expect(data[0]).toBe(30); // age
      expect(data[21]).toBe(123); // address.street
      expect(data[22]).toBe(0x39); // address.zip low (12345 = 0x3039)
      expect(data[23]).toBe(0x30); // address.zip high
      expect(data[24]).toBe(85); // scores[0]
      expect(data[25]).toBe(90); // scores[1]
      expect(data[26]).toBe(95); // scores[2]
    });
  });
});
