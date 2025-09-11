// utils/mailTemplates.js

export const resetPasswordMail = (to, resetLink) => ({
  from: '"Mediumify App" <noreply@mediumify.com>',
  to,
  subject: 'Reset Your Password',
  text: `Click the following link to reset your password: ${resetLink}`,
  html: `
       <div style="font-family: Arial, sans-serif; background: #f5f7fa; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 24px; border: 1px solid #e5e7eb;">
        
        <h2 style="color: #1e3a8a; text-align: center; margin-top: 0;">
          Reset Your Password
        </h2>
        
        <p style="color: #333; font-size: 15px; line-height: 1.6;">
          Hello 👋, you recently requested to reset your Mediumify account password.  
          Please click the button below to continue:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background: #4C83EE; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          If the button above doesn’t work, copy and paste this link into your browser:
        </p>
        
        <p style="word-break: break-word; font-size: 13px; color: #1e3a8a; margin: 16px 0;">
          <a href="${resetLink}" style="color: #1e3a8a;">${resetLink}</a>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <p style="color: #777; font-size: 12px; text-align: center; line-height: 1.5;">
          This link is valid for 24 hours.<br>
          If you did not request this reset, you can safely ignore this email.
        </p>
      </div>
    </div>
  `,
});
