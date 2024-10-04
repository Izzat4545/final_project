export interface EmailOptions {
  fromEmail: string;
  toEmail: string;
  toName: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
}
