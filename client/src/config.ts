export class Config {
  authAudience(): string {
    return this.get("REACT_APP_AUTH_AUDIENCE");
  }

  authClientId(): string {
    return this.get("REACT_APP_AUTH_CLIENT_ID");
  }

  authDomain(): string {
    return this.get("REACT_APP_AUTH_DOMAIN");
  }

  private get(field: string): string {
    if (process.env[field]) {
      return process.env[field] as string;
    } else {
      throw new Error(`Environment variable $field has not been set`);
    }
  }
}
