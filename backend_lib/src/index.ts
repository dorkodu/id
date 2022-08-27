import * as crypto from "crypto";

export class Oath {
  private readonly oathURI = "https://oath.dorkodu.com/api";

  public async auth(token: string) {
    return await this.request<{ userId: number }>("/api/auth/auth", { token });
  }

  public async temporaryAuth(token: string) {
    return await this.request<{ token: string }>("/api/auth/temporaryAuth", { token });
  }

  public async refreshAuth(token: string) {
    return await this.request<{ token: string }>("/api/auth/refreshAuth", { token });
  }

  public async logout(token: string) {
    return await this.request<{ token: string }>("/api/auth/logout", { token });
  }

  public generateXSRFToken() {
    return crypto.randomBytes(16).toString("base64url");
  }

  public validateXSRFToken(fromCookie: string, fromBody: string) {
    return fromCookie === fromBody;
  }

  private async request<T>(url: string, data?: any): Promise<{ data: Partial<T>, err: boolean }> {
    const options: RequestInit = { method: "POST" }
    if (data !== undefined) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data)
    }

    const res = await fetch(this.oathURI + url, options);
    const out = { data: await res.json(), err: !res.ok };

    return out;
  }
}