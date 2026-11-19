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
            .button { display: inline-block; background: #b3261e; color: #ffffff; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 50px; margin: 20px 0; }
            .item { border: 1px solid #e8e5df; border-radius: 12px; padding: 16px 20px; margin: 0 0 12px 0; }
            .item-name { font-weight: bold; margin: 0; color: #141414; }
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
              <p>Need help? Reply to this email or contact support@midiroad.com</p>
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
