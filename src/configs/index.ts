export class Configs {
  static instance: Configs;

  public static readonly BASE_URL: string = 'https://citygo-app.vercel.app/api/v1';

  public static readonly AUTH_TOKEN_KEY: string = 'auth-token-key';

  private constructor() {}

  public static getInstance() {
    if (!Configs.instance) {
      Configs.instance = new Configs();
    }
    return Configs.instance;
  }
}
