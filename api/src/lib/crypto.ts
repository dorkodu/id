import * as cyptography from "crypto";

async function encryptPassword() {

}

async function comparePassword() {

}

function sha256(input: cyptography.BinaryLike) {
  return cyptography.createHash("sha256").update(input).digest();
}

function bytes(length: number) {
  return cyptography.randomBytes(length);
}

export const crypto = {
  encryptPassword,
  comparePassword,
  sha256,
  bytes,
}