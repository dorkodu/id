import * as crypto from "crypto";

export function sha256(input: crypto.BinaryLike) {
  return crypto.createHash("sha256").update(input).digest();
}

export function utcTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function randomBytes(length: number) {
  return crypto.randomBytes(length);
}

export function convertEncoding(input: string, from: BufferEncoding, to: BufferEncoding) {
  return Buffer.from(input, from).toString(to);
}

export function toBinary(input: string, encoding: BufferEncoding) {
  return Buffer.from(input, encoding);
}

export function fromBinary(input: Buffer, encoding: BufferEncoding) {
  return input.toString(encoding);
}