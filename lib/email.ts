import { Resend } from "resend";

export async function sendEmail(email: string) {
  try {
    // Initialize inside the function to avoid crashing Next.js static build when .env is not present
    const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const downloadUrl = `${baseUrl}/downloads/midiroad.zip`;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Your MIDI + Drum Kit Bundle Receipt",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                line-height: 1.6; 
                color: #000000; 
                background-color: #ffffff; 
                margin: 0; 
                padding: 0; 
                -webkit-font-smoothing: antialiased; 
              }
              .wrapper { 
                background-color: #ffffff; 
                padding: 40px 20px; 
              }
              .container { 
                max-width: 500px; 
                margin: 0 auto; 
                background: #ffffff; 
                overflow: hidden; 
              }
              .header { 
                background: #ff90e8; 
                padding: 40px; 
                text-align: center; 
                border-radius: 16px 16px 0 0;
              }
              .logo { 
                display: inline-block; 
                font-size: 38px; 
                font-weight: 900; 
                color: #000000; 
                text-decoration: none; 
                letter-spacing: -2px; 
                background: #ffffff; 
                border-radius: 50%; 
                width: 70px; 
                height: 70px; 
                line-height: 70px; 
                margin: 0 auto;
              }
              .content { 
                padding: 40px 30px; 
                text-align: center; 
              }
              h1 { 
                font-size: 32px; 
                font-weight: 900; 
                margin-top: 0; 
                margin-bottom: 20px; 
                color: #000000; 
                letter-spacing: -1px; 
              }
              p { 
                color: #555555; 
                font-size: 17px; 
                font-weight: 500;
                margin-bottom: 30px; 
              }
              .download-button { 
                display: inline-block; 
                background: #000000; 
                color: #ffffff; 
                padding: 18px 36px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: 900; 
                font-size: 16px; 
                margin-bottom: 10px; 
                text-transform: uppercase; 
                letter-spacing: 1px; 
              }
              .link-container { 
                margin-top: 40px; 
                padding-top: 30px; 
                text-align: left; 
                background: #f9f9f9; 
                margin-bottom: -40px; 
                margin-left: -30px; 
                margin-right: -30px; 
                padding: 30px; 
              }
              .link-label { 
                font-size: 12px; 
                font-weight: 900; 
                text-transform: uppercase; 
                letter-spacing: 2px; 
                color: #666666; 
                margin-bottom: 8px; 
                display: block; 
              }
              .raw-link { 
                font-size: 15px; 
                color: #000000; 
                font-weight: bold; 
                text-decoration: underline; 
                word-break: break-all; 
              }
              .footer { 
                padding: 30px; 
                text-align: center; 
                background: #ffffff; 
              }
              .footer p { 
                color: #999999; 
                font-size: 14px; 
                font-weight: 600; 
                margin: 0; 
              }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="header">
                  <div class="logo">M</div>
                </div>
                <div class="content">
                  <h1>Your download is ready.</h1>
                  <p>Thanks for getting the Premium Bundle. Click below to instantly grab your files.</p>
                  <a href="${downloadUrl}" class="download-button">Download Bundle</a>
                  
                  <div class="link-container">
                    <span class="link-label">Direct Link</span>
                    <a href="${downloadUrl}" class="raw-link">${downloadUrl}</a>
                  </div>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} MidiRoad. All rights reserved.</p>
                  <p style="margin-top: 8px; font-weight: 500;">If you have any issues, reply to this email.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", result);
    return result;
  } catch (error: any) {
    console.error("Email send error:", error);
    throw error;
  }
}
