function utc() {
  return Math.floor(Date.now() / 1000);
}

function old() {
  return utc() - 1;
}

export const date = {
  utc,
  old,
}
