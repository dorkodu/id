export class Oath {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  public async auth(token: string) {

  }

  public async signup(email: string, password: string) {

  }

  public async login(email: string, password: string) {

  }

  public async logout(token: string) {

  }

  public async token(token: string) {

  }
}