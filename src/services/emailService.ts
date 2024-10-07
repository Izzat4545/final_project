import { EmailOptions } from "../types/emailOptions";
import { getEnv } from "../utils/getEnv";
import { logger } from "../config/logger/loggerMain";
import nodemailer from "nodemailer";

export const sendEmail = async (emailOptions: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: getEnv("EMAIL"),
      pass: getEnv("EMAIL_PASSWORD"),
    },
  });
  try {
    const info = await transporter.sendMail({
      from: emailOptions.fromEmail,
      to: emailOptions.toEmail,
      subject: emailOptions.subject,
      text: emailOptions.textBody,
      html: emailOptions.htmlBody,
    });
    logger.info(`Email sent: ${info.response}`);
    return { message: `Email sent successfully to ${emailOptions.toEmail}` };
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error(`Could not send email: ${error}`);
  }
};
