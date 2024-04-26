export class Configs {
  static instance: Configs;

  public static readonly APP_PREFIX = 'citygo://';

  public static readonly APP_DOMAIN = 'https://citygo.app';

  public static readonly BASE_URL: string = 'http://localhost:3000/api/v1';
  // public static readonly BASE_URL: string = `${this.DOMAIN}/api/v1`;

  public static readonly AUTH_TOKEN_KEY: string = 'auth-token-key';

  private constructor() {}

  public static getInstance() {
    if (!Configs.instance) {
      Configs.instance = new Configs();
    }
    return Configs.instance;
  }
}
