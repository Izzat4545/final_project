import Mailjet from "node-mailjet";
import { getEnv } from "../utils/getEnv";
import { EmailOptions } from "../types/emailOptions";

const mailjet = Mailjet.apiConnect(getEnv("EMAIL_KEY"), getEnv("EMAIL_SECRET"));

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: options.fromEmail,
            Name: options.fromName,
          },
          To: [
            {
              Email: options.toEmail,
              Name: options.toName,
            },
          ],
          Subject: options.subject,
          TextPart: options.textBody,
          HTMLPart: options.htmlBody,
        },
      ],
    });

    const result = await request;
    console.log(result.body);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
