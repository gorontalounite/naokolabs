// Hanya izinkan redirect internal ke dashboard; cegah open redirect lewat ?next=.
export function safeNext(value: FormDataEntryValue | string | null | undefined) {
  const next = typeof value === "string" ? value : "";
  if (next === "/app" || (next.startsWith("/app/") && !next.startsWith("//"))) return next;
  return "/app";
}
