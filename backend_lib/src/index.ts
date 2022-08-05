import { ApiCode, ApiReq, ApiRes } from "../../shared/types";

export class Oath {
  private id: string;
  private secret: string;
  private redirectURI: string;
  private readonly oathURI = "https://oath.dorkodu.com/api";

  constructor(clientId: string, clientSecret: string, redirectURI: string) {
    this.id = clientId;
    this.secret = clientSecret;
    this.redirectURI = redirectURI;
  }

  public async auth(token: string): Promise<number | null> {
    const { data, err } = await this.request(ApiCode.Auth, { token });
    if (!data || err) return null;
    return data.userId;
  }

  public async signup() {
    return `${this.oathURI}?type=signup&redirect_uri=${this.redirectURI}`;
  }

  public async login() {
    return `${this.oathURI}?type=login&redirect_uri=${this.redirectURI}`;
  }

  public async logout(token: string) {
    const { data, err } = await this.request(ApiCode.Logout, { token });
    if (!data || err) return false;
    return true;
  }

  public async token(token: string): Promise<string | null> {
    const { data, err } = await this.request(ApiCode.Token, { clientId: this.id, clientSecret: this.secret, token });
    if (!data || err) return null;
    return data.token;
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