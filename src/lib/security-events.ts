import * as Sentry from "@sentry/nextjs";

type SecurityEventName = "rate_limit_reached";

type SecurityEventContext = {
  route: string;
  scope: string;
};

export function reportSecurityEvent(event: SecurityEventName, context: SecurityEventContext) {
  console.warn("Security event", { event, ...context, occurredAt: new Date().toISOString() });
  Sentry.captureMessage(`security.${event}`, { level: "warning", extra: context });
}
