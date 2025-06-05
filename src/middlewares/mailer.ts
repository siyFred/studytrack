import nodemailer from 'nodemailer';
import { Request, Response, NextFunction } from 'express';

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export function mailerMiddleware(req: Request, res: Response, next: NextFunction) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  req.mailer = async (options: SendMailOptions) => {
    return transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...options
    });
  };
  next();
}

declare global {
  namespace Express {
    interface Request {
      mailer?: (options: SendMailOptions) => Promise<any>;
    }
  }
}
