declare module "#app" {
  interface RuntimeConfig {
    cloudflare: {
      accountId: string;
      accessKeyId: string;
      secretAccessKey: string;
      bucketName: string;
    };
  }

  interface PublicRuntimeConfig {
    imageBaseUrl: string;
  }
}
