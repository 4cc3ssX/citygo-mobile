export class Configs {
  static instance: Configs;

  public static readonly BASE_URL: string = 'http://localhost:3000/api/v1';

  public static readonly AUTH_TOKEN_KEY: string = 'auth-token-key';

  private constructor() {}

  public static getInstance() {
    if (!Configs.instance) {
      Configs.instance = new Configs();
    }
    return Configs.instance;
  }
}
