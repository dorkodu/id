export class Oath {
  private redirectURI: string;
  private readonly oathURI = "https://oath.dorkodu.com";

  private _xsrfToken: string = "";
  set xsrfToken(value: string) { this._xsrfToken = value; }
  get xsrfToken() { return this._xsrfToken; }

  constructor(redirectURI: string) {
    this.redirectURI = redirectURI;
  }

  public async login() {
    return `${this.oathURI}?type=login&redirect_uri=${this.redirectURI}`;
  }

  public async signup() {
    return `${this.oathURI}?type=signup&redirect_uri=${this.redirectURI}`;
  }

  public async logout() {
    return `${this.oathURI}?type=logout&redirect_uri=${this.redirectURI}`;
  }
}