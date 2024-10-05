export const emailTemplate = (
  email: string,
  name: string | null,
  code: string
) => {
  const template = {
    fromEmail: "no-reply@example.com",
    toEmail: email,
    toName: name || "User",
    subject: "Password Reset Code",
    textBody: `Hello ${
      name || "User"
    } your password reset link is https://example.com/${code}. It will expire in 10 minutes.`,
    htmlBody: `<p>Hello ${
      name || "User"
    } your password reset link is <strong>https://example.com/${code}</strong>. It will expire in 10 minutes.</p>`,
  };
  return template;
};
