import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string) {
  try {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const downloadUrl = `${baseUrl}/downloads/midi-drum-kit.zip`;

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
                background-color: #f4f4f0; 
                margin: 0; 
                padding: 0; 
                -webkit-font-smoothing: antialiased; 
              }
              .wrapper { 
                background-color: #f4f4f0; 
                padding: 40px 20px; 
              }
              .container { 
                max-width: 500px; 
                margin: 0 auto; 
                background: #ffffff; 
                border: 2px solid #000000; 
                box-shadow: 6px 6px 0px 0px #000000; 
                border-radius: 16px; 
                overflow: hidden; 
              }
              .header { 
                background: #ff90e8; 
                padding: 40px; 
                text-align: center; 
                border-bottom: 2px solid #000000; 
              }
              .logo { 
                display: inline-block; 
                font-size: 38px; 
                font-weight: 900; 
                color: #000000; 
                text-decoration: none; 
                letter-spacing: -2px; 
                background: #ffffff; 
                border: 3px solid #000000; 
                border-radius: 50%; 
                width: 70px; 
                height: 70px; 
                line-height: 70px; 
                box-shadow: 3px 3px 0px 0px #000000; 
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
                color: #333333; 
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
                border: 2px solid #000000;
                box-shadow: 4px 4px 0px 0px #ff90e8;
                font-weight: 900; 
                font-size: 16px; 
                margin-bottom: 10px; 
                text-transform: uppercase; 
                letter-spacing: 1px; 
              }
              .link-container { 
                margin-top: 40px; 
                padding-top: 30px; 
                border-top: 2px solid #000000; 
                text-align: left; 
                background: #f4f4f0; 
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
                border-top: 2px solid #000000;
              }
              .footer p { 
                color: #666666; 
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
                  <p>© ${new Date().getFullYear()} MIDIKits. All rights reserved.</p>
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
