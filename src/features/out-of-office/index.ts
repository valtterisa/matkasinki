// Out-of-Office — real away tool: auto-reply, triage, summarise.
// Sends a default "I'm away" email via Resend (src/lib/resend) to OOO_DEFAULT_TO.

export async function sendAwayEmail(_args: {
  to?: string;    // defaults to process.env.OOO_DEFAULT_TO
  message?: string;
}): Promise<void> {
  // TODO: use src/lib/resend once RESEND_API_KEY is set.
  throw new Error("not implemented");
}
