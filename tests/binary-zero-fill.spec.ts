import { BinaryField } from '../src/binary/binary-meta';
import { PayloadBase } from '../src/proto-base/payload-base';
import { fillBinaryFields, toBinaryFields } from '../src/binary/fill-binary-fields';

class TestArrayClass extends PayloadBase {
  @BinaryField('u16', 0, 8)
  numbers!: number[];

  @BinaryField('u32', 16, 4)
  values!: number[];
}

describe('Binary zero fill', () => {
  describe('toBinaryFields', () => {
    it('should zero fill when number array is shorter than expected length', () => {
      const obj = new TestArrayClass();
      obj.numbers = [1, 2, 3]; // Only 3 elements, expected 8
      obj.values = [100, 200]; // Only 2 elements, expected 4

      const buffer = toBinaryFields(obj);
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

      // Check first 3 elements of numbers array
      expect(view.getUint16(0, true)).toBe(1);
      expect(view.getUint16(2, true)).toBe(2);
      expect(view.getUint16(4, true)).toBe(3);

      // Check remaining 5 elements are zero
      expect(view.getUint16(6, true)).toBe(0);
      expect(view.getUint16(8, true)).toBe(0);
      expect(view.getUint16(10, true)).toBe(0);
      expect(view.getUint16(12, true)).toBe(0);
      expect(view.getUint16(14, true)).toBe(0);

      // Check first 2 elements of values array
      expect(view.getUint32(16, true)).toBe(100);
      expect(view.getUint32(20, true)).toBe(200);

      // Check remaining 2 elements are zero
      expect(view.getUint32(24, true)).toBe(0);
      expect(view.getUint32(28, true)).toBe(0);
    });

    it('should zero fill when array is empty', () => {
      const obj = new TestArrayClass();
      obj.numbers = []; // Empty array, expected 8
      obj.values = []; // Empty array, expected 4

      const buffer = toBinaryFields(obj);
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

      // All elements should be zero
      for (let i = 0; i < 8; i++) {
        expect(view.getUint16(i * 2, true)).toBe(0);
      }

      for (let i = 0; i < 4; i++) {
        expect(view.getUint32(16 + i * 4, true)).toBe(0);
      }
    });

    it('should zero fill when array is undefined', () => {
      const obj = new TestArrayClass();
      // Don't set numbers and values, they will be undefined

      const buffer = toBinaryFields(obj);
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

      // All elements should be zero
      for (let i = 0; i < 8; i++) {
        expect(view.getUint16(i * 2, true)).toBe(0);
      }

      for (let i = 0; i < 4; i++) {
        expect(view.getUint32(16 + i * 4, true)).toBe(0);
      }
    });

    it('should handle array with some undefined elements', () => {
      const obj = new TestArrayClass();
      obj.numbers = [1, 2, undefined as any, 4, 5]; // Has undefined element, expected 8
      obj.values = [100, undefined as any, 300]; // Has undefined element, expected 4

      const buffer = toBinaryFields(obj);
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

      expect(view.getUint16(0, true)).toBe(1);
      expect(view.getUint16(2, true)).toBe(2);
      expect(view.getUint16(4, true)).toBe(0); // undefined becomes 0
      expect(view.getUint16(6, true)).toBe(4);
      expect(view.getUint16(8, true)).toBe(5);
      expect(view.getUint16(10, true)).toBe(0); // zero fill
      expect(view.getUint16(12, true)).toBe(0); // zero fill
      expect(view.getUint16(14, true)).toBe(0); // zero fill

      expect(view.getUint32(16, true)).toBe(100);
      expect(view.getUint32(20, true)).toBe(0); // undefined becomes 0
      expect(view.getUint32(24, true)).toBe(300);
      expect(view.getUint32(28, true)).toBe(0); // zero fill
    });

    it('should work correctly with full-length arrays', () => {
      const obj = new TestArrayClass();
      obj.numbers = [1, 2, 3, 4, 5, 6, 7, 8]; // Full 8 elements
      obj.values = [100, 200, 300, 400]; // Full 4 elements

      const buffer = toBinaryFields(obj);
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

      for (let i = 0; i < 8; i++) {
        expect(view.getUint16(i * 2, true)).toBe(i + 1);
      }

      expect(view.getUint32(16, true)).toBe(100);
      expect(view.getUint32(20, true)).toBe(200);
      expect(view.getUint32(24, true)).toBe(300);
      expect(view.getUint32(28, true)).toBe(400);
    });
  });

  describe('fillBinaryFields', () => {
    it('should correctly read zero-filled arrays', () => {
      const buffer = new Uint8Array(32);
      const view = new DataView(buffer.buffer);

      // Set some values
      view.setUint16(0, 1, true);
      view.setUint16(2, 2, true);
      view.setUint16(4, 3, true);
      // Rest are already 0

      view.setUint32(16, 100, true);
      view.setUint32(20, 200, true);
      // Rest are already 0

      const obj = new TestArrayClass();
      fillBinaryFields(obj, buffer);

      expect(obj.numbers).toEqual([1, 2, 3, 0, 0, 0, 0, 0]);
      expect(obj.values).toEqual([100, 200, 0, 0]);
    });
  });

  describe('round-trip test', () => {
    it('should maintain zero-filled values through serialize/deserialize', () => {
      const obj1 = new TestArrayClass();
      obj1.numbers = [1, 2, 3]; // Shorter than 8
      obj1.values = [100, 200]; // Shorter than 4

      const buffer = toBinaryFields(obj1);
      
      const obj2 = new TestArrayClass();
      fillBinaryFields(obj2, buffer);

      expect(obj2.numbers).toEqual([1, 2, 3, 0, 0, 0, 0, 0]);
      expect(obj2.values).toEqual([100, 200, 0, 0]);
    });
  });
});
