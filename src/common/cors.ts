import type { ConfigService } from '@nestjs/config';

/** Comma-separated origins from CORS_ORIGIN, plus optional *.vercel.app previews. */
export function buildCorsOptions(config: ConfigService) {
  const raw = config.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000';
  const allowed = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const allowVercelPreviews =
    config.get<string>('CORS_ALLOW_VERCEL') !== 'false';

  return {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Server-to-server / curl
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowed.includes(origin)) {
        callback(null, true);
        return;
      }

      if (
        allowVercelPreviews &&
        /^https:\/\/[\w.-]+\.vercel\.app$/i.test(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
  };
}
