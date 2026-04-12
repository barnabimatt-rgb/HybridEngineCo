export type JobFn = () => Promise<void> | void;

export function scheduleInterval(
  label: string,
  fn: JobFn,
  ms: number
): void {
  setInterval(() => {
    fn().catch((err) => {
      console.error(`Scheduler job "${label}" failed`, err);
    });
  }, ms);
}
