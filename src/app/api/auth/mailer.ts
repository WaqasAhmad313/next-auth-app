import { Resend } from "resend";
import { ENV } from "../../../server/env";
import { render } from "@react-email/render";
import { logger } from "@/server/utils/logger"; 

const resend = new Resend(ENV.RESEND_API_KEY);

type SendEmailOptions = {
  to: string;
  subject: string;
  react?: React.ReactElement;
  html?: string;
  from?: string; 
};

export async function sendEmail({
  to,
  subject,
  react,
  html,
  from = "onboarding@resend.dev", 
}: SendEmailOptions) {
  try {
    if (!to || !subject) {
      throw new Error("Missing required fields: to or subject");
    }

    // ✅ Convert React email template to HTML if provided
    const emailContent = react ? await render(react) : html;
    if (!emailContent) throw new Error("No email content provided");

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html: emailContent,
      text:
        typeof emailContent === "string"
          ? emailContent.replace(/<[^>]+>/g, "") // strip HTML for plaintext version
          : "Email content",
    });

    logger.info(`✅ Email sent to ${to}: ${subject}`);
    return result;
  } catch (err) {
    logger.error("❌ Error sending email:", err);
    // ✅ Return structured error for better handling upstream
    return {
      success: false,
      message: "Failed to send email",
      error: (err as Error).message,
    };
  }
}
