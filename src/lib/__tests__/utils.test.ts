import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional');
      expect(cn('base', false && 'conditional')).toBe('base');
    });

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null)).toBe('base');
    });

    it('should merge conflicting Tailwind classes', () => {
      expect(cn('px-2 px-4')).toBe('px-4');
      expect(cn('bg-red-500 bg-blue-500')).toBe('bg-blue-500');
    });

    it('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });

    it('should handle objects with boolean values', () => {
      expect(cn({
        'class1': true,
        'class2': false,
        'class3': true
      })).toBe('class1 class3');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
    });

    it('should handle complex combinations', () => {
      const result = cn(
        'base-class',
        ['array-class1', 'array-class2'],
        {
          'object-class': true,
          'hidden-class': false
        },
        'px-2 px-4',
        undefined,
        null
      );
      expect(result).toBe('base-class array-class1 array-class2 object-class px-4');
    });
  });
});
