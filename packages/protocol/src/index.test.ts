import { describe, expect, it } from 'vitest';
import { isHelloMessage } from './index';

describe('protocol handshake validation', () => {
  it('accepts the supported handshake', () => {
    expect(isHelloMessage({ type: 'hello', protocolVersion: 1 })).toBe(true);
  });
  it.each([
    null,
    undefined,
    'hello',
    [],
    {},
    { type: 'hello' },
    { type: 'hello', protocolVersion: 2 },
    { type: 'hello', protocolVersion: '1' },
    { type: 'snapshot', protocolVersion: 1 },
  ])('rejects malformed or incompatible input: %j', (value: unknown) => {
    expect(isHelloMessage(value)).toBe(false);
  });
});
