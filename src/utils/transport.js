import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.MAILTRAP_SMTP_PORT),
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
});
