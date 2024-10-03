export interface EmailOptions {
  fromEmail: string;
  fromName: string;
  toEmail: string;
  toName: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
}
