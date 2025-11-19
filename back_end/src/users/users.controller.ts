import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { createUserDto } from './dto/createUser.dto';
import { uptadeUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';
import { MailService } from 'src/mail/mail.service';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService, private mailService: MailService) {}

    @Get()
    getAll() { return this.service.findAll(); }

    @Get(':id')
    getById(@Param('id') id: String) { return this.service.getUser(String(id)); }

    @Post()
    create(@Body() dto: createUserDto) {
        return this.service.createPost(dto);
    }

    @Patch(':id')
    update(@Param('id') id: String, @Body() dto: uptadeUserDto) {
        return this.service.update(String(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.delete(String(id));
    }
    // 🆕 ENDPOINT PARA BROADCAST
    @Post('admin/broadcast')
    async sendBroadcast(@Body() body: { asunto: string; mensaje: string }) {
        const usuarios = await this.service.findAll();
        // Filtrar solo clientes activos
        const clientes = usuarios.filter(u => u.rol === 'Cliente' && u.isActive);
        
        let enviados = 0;
        for (const cliente of clientes) {
            if (cliente.email) {
                // Enviar correo (puedes hacerlo asíncrono sin await para no bloquear, o con await para asegurar)
                this.mailService.sendMail(cliente.email, `📢 ${body.asunto}`, body.mensaje);
                enviados++;
            }
        }
        return { message: `Mensaje enviado a ${enviados} clientes.` };
    }
}
