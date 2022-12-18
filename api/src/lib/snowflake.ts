import { config } from "../config";

class SnowflakeGenerator {
  public static readonly epochTime: number = config.epochTime;
  public static readonly machineId: number = config.machineId;

  public lastTimestamp: number = -1;

  public timestamp: number;
  public sequenceId: number;

  constructor() {
    this.timestamp = Date.now();
    this.sequenceId = 0;
  }

  public id() {
    this.timestamp = Date.now();

    if (this.timestamp < this.lastTimestamp) {
      this.timestamp = this.lastTimestamp;
    }

    if (this.timestamp === this.lastTimestamp) {
      this.sequenceId = this.sequenceId + 1;
      if (this.sequenceId === 0) this.timestamp++;
    }
    else {
      this.sequenceId = 0;
    }

    this.lastTimestamp = this.timestamp;

    return {
      timestamp: this.timestamp,
      machine: SnowflakeGenerator.machineId,
      sequence: this.sequenceId
    };
  }
}

const generators = {
  "users": new SnowflakeGenerator(),
  "sessions": new SnowflakeGenerator(),

  "email_new_location": new SnowflakeGenerator(),
  "email_verify_email": new SnowflakeGenerator(),
  "email_confirm_email": new SnowflakeGenerator(),
  "email_revert_email": new SnowflakeGenerator(),
  "email_change_password": new SnowflakeGenerator(),

  "access_tokens": new SnowflakeGenerator(),
  "access_codes": new SnowflakeGenerator(),
}

function id(generator: keyof typeof generators) {
  return generators[generator].id();
}

export const snowflake = { id }