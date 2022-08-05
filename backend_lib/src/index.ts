import { ApiCode, ApiReq, ApiRes } from "../../shared/types";

import * as crypto from "crypto";

export class Oath {
  private id: string;
  private secret: string;
  private readonly oathURI = "https://oath.dorkodu.com/api";

  constructor(clientId: string, clientSecret: string) {
    this.id = clientId;
    this.secret = clientSecret;
  }

  public async auth(token: string): Promise<number | null> {
    const { data, err } = await this.request(ApiCode.Auth, { token });
    if (!data || err) return null;
    return data.userId;
  }

  public async token(token: string): Promise<string | null> {
    const { data, err } = await this.request(ApiCode.Token, { clientId: this.id, clientSecret: this.secret, token });
    if (!data || err) return null;
    return data.token;
  }

  public generateXSRFToken() {
    return crypto.randomBytes(16).toString("base64url");
  }

  public validateXSRFToken(fromCookie: string, fromBody: string) {
    return fromCookie === fromBody;
  }

  private async request<T extends ApiCode>(type: T, req: ApiReq[T]): Promise<ApiRes[T]> {
    const res = await fetch(this.oathURI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type, data: req })
    });
    const json = await res.json();

    return json;
  }
}