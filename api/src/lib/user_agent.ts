import { UAParser } from "ua-parser-js";

function parse(userAgent: string | undefined): string {
  if (!userAgent) return "";

  const { browser, cpu, device, engine, os } = new UAParser(userAgent).getResult();

  const tags = [
    browser.name, browser.version,
    cpu.architecture,
    device.vendor, device.model,
    engine.name, engine.version,
    os.name, os.version,
  ].join(",");

  return tags.slice(0, 256);
}

export const userAgent = {
  parse,
}