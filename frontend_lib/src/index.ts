export class Oath {
  private readonly oathURI = "https://oath.dorkodu.com";
  private redirectURI: string;

  public xsrfToken: string = "";

  constructor(redirectURI: string) {
    this.redirectURI = redirectURI;
  }

  public async login() {
    return `${this.oathURI}/api/auth/login?redirect_uri=${this.redirectURI}`;
  }

  public async signup() {
    return `${this.oathURI}/api/auth/signup?redirect_uri=${this.redirectURI}`;
  }
}