function utc() {
  return Math.floor(Date.now() / 1000);
}

export const date = {
  utc,
}
