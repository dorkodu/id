import * as crypto from "crypto";

export function utcTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function sha256(input: crypto.BinaryLike) {
  return crypto.createHash("sha256").update(input).digest();
}

export function randomBytes(length: number) {
  return crypto.randomBytes(length);
}

/**
 * Converts encodings. Do not use to convert from or to binary.
 * @param input 
 * @param from 
 * @param to 
 * @returns 
 */
export function convertEncoding(input: string, from: BufferEncoding, to: BufferEncoding) {
  return Buffer.from(input, from).toString(to);
}

export function toBinary(input: string, from: BufferEncoding) {
  return Buffer.from(input, from);
}

export function fromBinary(input: Buffer, to: BufferEncoding) {
  return input.toString(to);
}

export function compareBinary(a: Buffer, b: Buffer) {
  return a.compare(b) === 0;
}

export function checkUsername(username: string): boolean {
  const result = /([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,14}(?:[A-Za-z0-9_]))?)/g.exec(username);
  if (result === null) return false;
  return result[0].length === username.length;
}