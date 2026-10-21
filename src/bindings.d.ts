// void.config.ts の cloudflare.r2_buckets で宣言した独自バインディング。
// Void の CloudBindings(c.env の型)はこの global interface を継承している
declare global {
  interface VoidGeneratedEnvBindings {
    MEDIA: R2Bucket;
  }
}

export {};
