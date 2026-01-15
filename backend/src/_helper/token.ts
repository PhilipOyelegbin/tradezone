export class Token {
  constructor() {}

  generateBasicToken(): { token: string; expiration: Date } {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationLength = Date.now() + 3600000; // 1 hour
    const expiration = new Date(expirationLength);
    return { token, expiration };
  }
}
