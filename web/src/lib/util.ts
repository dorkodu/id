import Identicon from "identicon.js";

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

function generateAvatar(username: string) {
  const hash = (username + "0".repeat(16)).substring(0, 16).split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
  return `data:image/svg+xml;base64,${new Identicon(hash, { format: "svg" }).toString()}`;
}

export const util = {
  parseUserAgent,
  compareId,
  generateAvatar,
}