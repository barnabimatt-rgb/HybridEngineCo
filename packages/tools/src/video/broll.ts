import { createLogger } from "../logging";
const log = createLogger("tools:broll");

export function buildBrollFilters(): string[] {
  // Placeholder: later we’ll support multiple clips
  log("broll_filters_applied", {});
  return [
    "fade=t=in:st=0:d=1",
    "fade=t=out:st=59:d=1"
  ];
}
