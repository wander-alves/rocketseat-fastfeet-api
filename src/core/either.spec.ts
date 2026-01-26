import { describe, it, expect } from 'vitest';

import { left, right } from './either';

describe('Either', () => {
  it('shuld return success when isRight is true', () => {
    const result = right('success');

    expect(result.value).toBe('success');
    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });

  it('shuld return an error when isLeft is true', () => {
    const result = left('error');

    expect(result.value).toBe('error');
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
  });
});
