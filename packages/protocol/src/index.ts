export const PROTOCOL_VERSION = 1;

export interface HelloMessage {
  readonly type: 'hello';
  readonly protocolVersion: typeof PROTOCOL_VERSION;
}

/** External data stays unknown until the complete message shape is validated. */
export function isHelloMessage(value: unknown): value is HelloMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'hello' &&
    'protocolVersion' in value &&
    value.protocolVersion === PROTOCOL_VERSION
  );
}
