import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string) {
  const downloadLink = `${process.env.BASE_URL || "https://midiroad.com"}/downloads/midiroad.zip`;

  const { data, error } = await resend.emails.send({
    from: "MidiRoad <onboarding@resend.dev>",
    to: [to],
    subject: "Your MidiRoad Bundle is Ready! 🎵",
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
            .button { display: inline-block; background: #ff90e8; color: black; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 50px; margin: 20px 0; }
            .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${process.env.BASE_URL || "https://midiroad.com"}/logo-white.png" alt="MidiRoad" />
            </div>
            <div class="content">
              <h1>Payment Confirmed! 🎉</h1>
              <p>Thanks for your purchase! Your MidiRoad Bundle is ready to download.</p>
              <p>Click the button below to get your files:</p>
              <a href="${downloadLink}" class="button">Download Your Bundle</a>
              <p style="font-size: 14px; color: #666;">This download link will work for 30 days.</p>
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
