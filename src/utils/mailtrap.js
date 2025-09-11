import { MailtrapClient } from 'mailtrap';

const TOKEN = process.env.MAILTRAP_TOKEN ?? '';
const INBOX_ID = Number(process.env.MAILTRAP_INBOX_ID ?? '');
const ACCOUNT_ID = Number(process.env.MAILTRAP_ACCOUNT_ID ?? '');

export const mailtrap = new MailtrapClient({
  token: TOKEN,
  testInboxId: INBOX_ID,
  accountId: ACCOUNT_ID,
});

export const sender = {
  email: 'hello@example.com',
  name: 'Mailtrap Test',
};
