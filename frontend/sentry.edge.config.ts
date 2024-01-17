import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4962b273091b448c10467d7d51111484@o1234952.ingest.sentry.io/4506582361964544",
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 1,
  debug: false,
});
