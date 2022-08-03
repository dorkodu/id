import * as crypto from "crypto";

export function sha256(input: string, encoding: crypto.BinaryToTextEncoding) {
  return crypto.createHash("sha256").update(input).digest(encoding);
}

export function base64urlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

export function base64urlDecode(input: string) {
  return Buffer.from(input).toString("binary");
}

export function utcTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function randomBytes(length: number, encoding?: BufferEncoding) {
  return crypto.randomBytes(length).toString(encoding);
}

export function convertEncoding(input: string, to: BufferEncoding) {
  return Buffer.from(input).toString(to);
}