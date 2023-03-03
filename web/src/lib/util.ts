function parseUserAgent(ua: string) {
  return ua.split(",").filter(value => value !== "").join(" | ");
}

function compareId(a: string, b: string, reverse?: boolean) {
  if (a.length > b.length) b = "0".repeat(a.length - b.length) + b;
  else if (a.length < b.length) a = "0".repeat(b.length - a.length) + a;

  if (a < b) return !reverse ? -1 : +1;
  if (a > b) return !reverse ? +1 : -1;
  return 0;
}

export const util = {
  parseUserAgent,
  compareId,
}