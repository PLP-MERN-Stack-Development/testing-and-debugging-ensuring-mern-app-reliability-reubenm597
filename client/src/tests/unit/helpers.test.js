import { formatDate, truncateText, validateEmail, debounce } from '../../utils/helpers';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const dateString = '2023-12-25T10:30:00.000Z';
      const formatted = formatDate(dateString);
      expect(formatted).toBe('December 25, 2023');
    });

    it('handles invalid date gracefully', () => {
      const invalidDate = 'invalid-date';
      const formatted = formatDate(invalidDate);
      expect(formatted).toBe('Invalid Date');
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than max length', () => {
      const longText = 'This is a very long text that should be truncated';
      const truncated = truncateText(longText, 20);
      expect(truncated).toBe('This is a very long...');
      expect(truncated.length).toBe(23); // 20 + 3 for ellipsis
    });

    it('returns original text if shorter than max length', () => {
      const shortText = 'Short text';
      const result = truncateText(shortText, 20);
      expect(result).toBe(shortText);
    });

    it('uses default max length when not provided', () => {
      const longText = 'a'.repeat(150);
      const result = truncateText(longText);
      expect(result.length).toBe(103); // 100 + 3 for ellipsis
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');
    });
  });
});