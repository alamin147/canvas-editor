import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.user_email,
      pass: config.user_password,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You requested a password reset. Please click the button below to reset your password. This link is valid for 10 minutes.</p>
      <a href="${resetLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>If the button doesn't work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all;">${resetLink}</p>
    </div>
  `;

  await transporter.sendMail({
    from: config.user_email, // sender address
    to, // list of receivers
    subject: 'Reset your password within ten minutes!', // Subject line
    text: `Reset your password: ${resetLink}`, // plain text body
    html, // html body
  });
};
