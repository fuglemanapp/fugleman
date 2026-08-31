type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

import { createHash } from "node:crypto";

import { servicePrisma } from "@/lib/prisma-service";

type RateLimitBucket = {
  count: number;
  resetAt: Date;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

function bucketKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Consumes an atomic bucket shared by every server instance. The hashed key
 * avoids retaining email addresses or user IDs in the rate-limit table.
 */
export async function consumeRateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const resetAt = new Date(Date.now() + options.windowMs);
  const [bucket] = await servicePrisma.$queryRaw<RateLimitBucket[]>`
    INSERT INTO "RateLimitBucket" ("key", "count", "resetAt", "updatedAt")
    VALUES (${bucketKey(key)}, 1, ${resetAt}, NOW())
    ON CONFLICT ("key") DO UPDATE
    SET
      "count" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW() THEN 1
        ELSE "RateLimitBucket"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW() THEN ${resetAt}
        ELSE "RateLimitBucket"."resetAt"
      END,
      "updatedAt" = NOW()
    RETURNING "count", "resetAt"
  `;

  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt.getTime() - Date.now()) / 1_000));

  return {
    allowed: bucket.count <= options.limit,
    remaining: Math.max(0, options.limit - bucket.count),
    retryAfterSeconds,
  };
}
