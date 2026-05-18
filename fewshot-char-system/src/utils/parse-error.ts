export function parseError(error: unknown): Error {
  if (error instanceof Error) return error;

  const errorString = typeof error === 'string' ? error : String(error);

  // 匹配形如 AssertionError('xxx')
  const match =
    /^(?<name>[A-Za-z_][A-Za-z0-9_]*)\((['"]?)(?<message>.*)\2\)$/.exec(
      errorString
    );

  if (match?.groups) {
    const { name, message } = match.groups;

    return {
      name,
      message,
    };
  }

  return {
    name: 'Error',
    message: errorString,
  };
}
