// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4962b273091b448c10467d7d51111484@o1234952.ingest.sentry.io/4506582361964544",
  enabled: process.env.NODE_ENV === 'production',
  ignoreErrors: ["mutating the data"],
  tracesSampleRate: 1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: true,
    }),
  ],
});
