// src/solicitud-pedidos/solicitud-pedido.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common'; // Añadir UseGuards y Request
import { createSolicitudPedidoDto } from './dto/createSolicitud-pedido.dto';
import { updateSolicitudPedidoDto } from './dto/updateSolicitud-pedido';
import { SolicitudPedidosService } from './solicitud-pedidos.service';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Importar el Guard
@UseGuards(JwtAuthGuard)
@Controller('solicitud-pedidos')
export class SolicitudPedidosController {
    constructor(
        private readonly solicitudesService: SolicitudPedidosService,
        private readonly mailService: MailService,       
        private readonly usersService: UsersService      
    ) {}

    // RUTA PROTEGIDA: Ahora utiliza el ID del token (req.user.userId)

    @Post('me')
    async createForMe(@Body() dto: createSolicitudPedidoDto, @Request() req) {
        // 1. EXTRAER el usuarioId del JWT
        const userId = req.user.userId;

        // 2. Crea la solicitud llamando al servicio con el userId del token
        // NOTA: EL SERVICIO DEBE ADAPTARSE PARA RECIBIR 'userId' como primer argumento
        const solicitud = await this.solicitudesService.create(userId, dto); // <--- CAMBIO CLAVE

        // 3. Busca el usuario y su perfil (usando el ID extraído)
        const user = await this.usersService.getUser(userId); 

        // 4. Extrae los datos del perfil (la lógica del email se mantiene)
        const nombre = user.perfil.firstName;
        const direccion = user.perfil.restaurant;
        const email = user.perfil.direction; // Campo que se usa como email
        const emailAdmin = "Cipxiaomi55@gmail.com"
        
        // 5. Valida el email
        if (!email) {
            throw new Error('El usuario no tiene email definido en su perfil');
        }

        // 6. Prepara el cuerpo del correo (Se mantiene la lógica original)
        const bodyMsg = `Hola ${nombre}, tu solicitud de pedido fue registrada para ${direccion}.
        Cantidad Grano: ${dto.grano}
        Cantidad Molido: ${dto.molido}
        Fecha de entrega: ${dto.fechaEntrega}
        Notas adcionales: ${dto.notas}
        Te confirmaremos tu pedido en breve.`;

        const MsgAdmin = 
        `Solicitud de pedido creada favor de confirmarla para ${direccion}.
        Descripcion del pedido
        User:  ${userId}
        Cantidad Grano: ${dto.grano}
        Cantidad Molido: ${dto.molido}
        Fecha de entrega: ${dto.fechaEntrega}
        Notas: ${dto.notas}`

        // 7. Envía los correos (Se mantiene la lógica original)
        await this.mailService.sendMail(
            email,
            'Confirmación de solicitud de pedido',
            bodyMsg
        );
        await this.mailService.sendMail(
            emailAdmin,
            'Confirmación de solicitud de pedido',
            MsgAdmin
        );

        return solicitud;
    }

    @Get('me') // Nueva ruta para obtener las solicitudes del usuario actual
    getMySolicitudes(@Request() req) {
        const userId = req.user.userId;
        return this.solicitudesService .findByUsuarioId(userId);
    }
    @Get()
    findAll() {
        return this.solicitudesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.solicitudesService.findOne(String(id));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: updateSolicitudPedidoDto) {
        return this.solicitudesService.update(String(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.solicitudesService.remove(String(id));
    }
}
