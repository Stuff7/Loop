export function assertNull<T>(
  value: T,
  ...message: string[]
): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error(
      `Expected value to be defined but received ${value}: ${message.join(' ')}`,
    );
  }
}

export function assertFalse<T>(
  value: T,
  ...message: string[]
): asserts value {
  if (!value) {
    throw new Error(
      `Expected value to be truthy but received ${value}: ${message.join(' ')}`,
    );
  }
}
