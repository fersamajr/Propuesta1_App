import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service'; // ⬅️ Importante

@Controller()
export class AppController {
  // Inyectamos MailService en el constructor
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService 
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 👇 ESTE ES EL BLOQUE QUE TE FALTA 👇
  @Post('contact')
  async sendContactForm(@Body() body: { nombre: string; email: string; mensaje: string }) {
    const adminEmail = process.env.ADMIN_EMAIL || "Cipxiaomi55@gmail.com";

    // Enviar correo al Admin
    await this.mailService.sendMail(
      adminEmail,
      `🔔 Nuevo Mensaje de Contacto: ${body.nombre}`,
      `Has recibido un mensaje desde la web:\n\n👤 Nombre: ${body.nombre}\n📧 Email/Tel: ${body.email}\n📝 Mensaje: ${body.mensaje}`
    );

    // Confirmación (opcional)
    if (body.email && body.email.includes('@')) {
        try {
            await this.mailService.sendMail(
                body.email,
                'Hemos recibido tu mensaje ☕',
                `Hola ${body.nombre},\n\nGracias por contactarnos. Te responderemos pronto.\n\nAtte: El equipo.`
            );
        } catch (e) {
            console.log("No se pudo enviar confirmación al cliente (quizás no es un email válido)");
        }
    }

    return { message: 'Mensaje enviado correctamente' };
  }
}