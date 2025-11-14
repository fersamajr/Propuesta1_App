// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
        service: 'gmail', // puedes usar cualquier otro (Outlook, SMTP propio, etc)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        });
    }

    async sendMail(to: string, subject: string, text: string) {
        const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        });
        console.log('Correo enviado:', info.messageId);
        return info;
    }
}
