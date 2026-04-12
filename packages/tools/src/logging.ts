export function createLogger(scope: string) {
  return (msg: string, meta: Record<string, unknown> = {}) => {
    const payload = { scope, msg, ...meta, ts: new Date().toISOString() };
    console.log(JSON.stringify(payload));
  };
}
