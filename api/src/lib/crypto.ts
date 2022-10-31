import * as cyptography from "crypto";

function sha256(input: cyptography.BinaryLike) {
  return cyptography.createHash("sha256").update(input).digest();
}

export function bytes(length: number) {
  return cyptography.randomBytes(length);
}

export const crypto = {
  sha256,
  bytes,
}