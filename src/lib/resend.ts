import { Resend } from "resend";

// Requires RESEND_API_KEY (see FEATURES.md → Resend setup).
export const resend = new Resend(process.env.RESEND_API_KEY);
