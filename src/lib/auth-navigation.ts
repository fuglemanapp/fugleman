const DEFAULT_CALLBACK_PATH = "/dashboard";

export function safeCallbackPath(value: unknown) {
  if (typeof value !== "string") return DEFAULT_CALLBACK_PATH;

  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return DEFAULT_CALLBACK_PATH;
  }

  return path;
}
