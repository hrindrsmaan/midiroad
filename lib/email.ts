import { Resend } from "resend";

// Created on first send, so a missing RESEND_API_KEY fails that send, not every import.
let client: Resend | undefined;
const resend = {
  get emails() {
    client ??= new Resend(process.env.RESEND_API_KEY);
    return client.emails;
  },
};

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

/**
 * The free MIDI kit: a download link (valid for FREE_KIT_LINK_DAYS) and an
 * unsubscribe link, in the footer and as List-Unsubscribe headers so mail
 * apps show their own one-click unsubscribe. Without RESEND_API_KEY (local
 * development) the email is logged instead of sent.
 */
export async function sendFreeKitEmail({
  to,
  downloadUrl,
  unsubscribeUrl,
  kitName,
  patternCount,
  days,
}: {
  to: string;
  downloadUrl: string;
  unsubscribeUrl: string;
  kitName: string;
  patternCount: number;
  days: number;
}) {
  const base = process.env.BASE_URL || "https://midiroad.com";
  const subject = `Your free MIDI kit: ${patternCount} patterns from MidiRoad`;
  const text = `Here's the ${kitName}: ${patternCount} royalty-free MIDI drum patterns for trap and drill.

Download (link works for ${days} days):
${downloadUrl}

Drag a .mid file onto a drum or 808 channel in your DAW and set the project to the BPM in the file name.

More patterns: ${base}/midi
Free beat maker: ${base}/beat-maker

You're getting this because you asked for the free kit at midiroad.com. MidiRoad will send occasional emails with new patterns and offers.
Unsubscribe: ${unsubscribeUrl}`;

  if (!process.env.RESEND_API_KEY) {
    console.info(`[free-kit] RESEND_API_KEY not set, email not sent to ${to}:\n${text}`);
    return { sent: false as const };
  }

  const { error } = await resend.emails.send({
    from: "MidiRoad <noreply@midiroad.com>",
    replyTo: "MidiRoad Support <support@inbox.midiroad.com>",
    to: [to],
    subject,
    text,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: `
      <div style="background:#f4f4f0;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
          <div style="background:#0f172a;padding:24px;text-align:center;">
            <img src="${base}/brand/midiroad-logo-white.png" alt="MidiRoad" style="height:36px;" />
          </div>
          <div style="padding:32px 28px;color:#0f172a;">
            <h1 style="font-size:24px;margin:0 0 12px;">Your free MIDI kit is ready</h1>
            <p style="line-height:1.6;margin:0 0 8px;color:#333;">The ${kitName}: ${patternCount} royalty-free MIDI drum patterns, two from each style (trap, street trap, melodic trap, dark trap, drill and 808 bass).</p>
            <a href="${downloadUrl}" style="display:inline-block;background:#22c55e;color:#0f172a;padding:14px 28px;border-radius:4px;text-decoration:none;font-weight:bold;margin:16px 0;">Download the kit</a>
            <p style="font-size:14px;line-height:1.6;color:#555;margin:0 0 16px;">The link works for ${days} days. Drag a .mid file onto a drum or 808 channel in FL Studio, Ableton, Logic or any DAW, and set the project to the BPM in the file name.</p>
            <p style="font-size:14px;line-height:1.6;color:#555;margin:0;">Want more? <a href="${base}/midi" style="color:#7c3aed;">Browse every pattern</a> or <a href="${base}/beat-maker" style="color:#7c3aed;">make a beat in the free beat maker</a>.</p>
          </div>
          <div style="background:#f9f9f9;padding:18px 28px;font-size:12px;line-height:1.6;color:#666;text-align:center;">
            <p style="margin:0 0 6px;">You're getting this because you asked for the free kit at midiroad.com. MidiRoad sends occasional emails with new patterns and offers.</p>
            <p style="margin:0;"><a href="${unsubscribeUrl}" style="color:#666;">Unsubscribe</a> · © ${new Date().getFullYear()} MidiRoad</p>
          </div>
        </div>
      </div>`,
  });
  if (error) throw error;
  return { sent: true as const };
}
