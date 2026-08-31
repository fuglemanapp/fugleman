import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ captureMessage: vi.fn() }));

vi.mock("@sentry/nextjs", () => ({ captureMessage: mocks.captureMessage }));

import { reportSecurityEvent } from "./security-events";

describe("reportSecurityEvent", () => {
  it("sends only route and scope to Sentry", () => {
    reportSecurityEvent("rate_limit_reached", {
      route: "/api/chat/uploads",
      scope: "chat_upload",
    });

    expect(mocks.captureMessage).toHaveBeenCalledWith("security.rate_limit_reached", {
      level: "warning",
      extra: { route: "/api/chat/uploads", scope: "chat_upload" },
    });
  });
});
