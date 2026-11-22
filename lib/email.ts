import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailItem = { id: string; name: string };

/** Fulfillment email: one download button per product in the order. */
export async function sendEmail(to: string, sessionId: string, items: EmailItem[]) {
  const base = `${process.env.BASE_URL || "https://midiroad.com"}/api/download?session_id=${encodeURIComponent(sessionId)}`;
  const link = (item: EmailItem) =>
    items.length === 1 ? base : `${base}&product=${encodeURIComponent(item.id)}`;
  const productName = items.length === 1 ? items[0].name : `${items.length} MIDI kits`;
  const downloads = items
    .map(
      (item) => `
              <div class="item">
                <p class="item-name">${item.name}</p>
                <a href="${link(item)}" class="button">Download</a>
              </div>`,
    )
    .join("");

  const { data, error } = await resend.emails.send({
    from: "MidiRoad <noreply@midiroad.com>",
    replyTo: "MidiRoad Support <support@inbox.midiroad.com>",
    to: [to],
    subject: `Your download is ready: ${productName} 🎵`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f0; margin: 0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: black; padding: 30px; text-align: center; }
            .header img { height: 40px; }
            .content { padding: 40px 30px; }
            h1 { color: #000; font-size: 28px; margin: 0 0 20px 0; }
            p { color: #333; line-height: 1.6; margin: 0 0 20px 0; }
            .button { display: inline-block; background: #7c3aed; color: #ffffff; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 4px; margin: 20px 0; }
            .item { border: 1px solid #e8e5df; border-radius: 12px; padding: 16px 20px; margin: 0 0 12px 0; }
            .item-name { font-weight: bold; margin: 0; color: #0f172a; }
            .item .button { margin: 12px 0 0 0; padding: 12px 24px; }
            .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${process.env.BASE_URL || "https://midiroad.com"}/brand/midiroad-logo-white.png" alt="MidiRoad" />
            </div>
            <div class="content">
              <h1>Payment Confirmed! 🎉</h1>
              <p>Thanks for your purchase! Your files are ready to download:</p>
              ${downloads}
              <p style="font-size: 14px; color: #666;">Keep this email — you can re-download from this link anytime.</p>
            </div>
            <div class="footer">
              <p>Need help? Reply to this email or contact support@inbox.midiroad.com</p>
              <p>© ${new Date().getFullYear()} MidiRoad</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Email send error:", error);
    throw error;
  }

  return data;
}

/** Sign-in email for the magic link (passwordless login). */
export async function sendMagicLinkEmail(to: string, url: string) {
  const { error } = await resend.emails.send({
    from: "MidiRoad <noreply@midiroad.com>",
    replyTo: "MidiRoad Support <support@inbox.midiroad.com>",
    to: [to],
    subject: "Your MidiRoad sign-in link",
    text: `Sign in to MidiRoad:\n\n${url}\n\nThis link expires in 5 minutes and works once. If you didn't ask for it, ignore this email.`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 20px; color: #0f172a;">
        <h1 style="font-size: 22px; margin: 0 0 16px;">Sign in to MidiRoad</h1>
        <p style="line-height: 1.6; margin: 0 0 24px; color: #333;">Click the button to sign in. The link expires in 5 minutes and works once.</p>
        <a href="${url}" style="display: inline-block; background: #7c3aed; color: #fff; padding: 14px 28px; border-radius: 4px; text-decoration: none; font-weight: bold;">Sign in</a>
        <p style="font-size: 13px; color: #6b6864; margin: 28px 0 0;">If you didn't ask for this, you can ignore this email.</p>
      </div>`,
  });
  if (error) throw error;
}
