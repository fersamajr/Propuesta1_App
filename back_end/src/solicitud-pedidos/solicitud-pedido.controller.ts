import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { createSolicitudPedidoDto } from './dto/createSolicitud-pedido.dto';
import { updateSolicitudPedidoDto } from './dto/updateSolicitud-pedido';
import { SolicitudPedidosService } from './solicitud-pedidos.service';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';

@Controller('solicitud-pedidos')
export class SolicitudPedidosController {
    constructor(
        private readonly solicitudesService: SolicitudPedidosService,
        private readonly mailService: MailService,        // Asegúrate de inyectarlo
        private readonly usersService: UsersService       // Igualmente
    ) {}

    @Post()
    async create(@Body() dto: createSolicitudPedidoDto) {
        // 1. Crea la solicitud normalmente
        const solicitud = await this.solicitudesService.create(dto);

        // 2. Busca el usuario y su perfil
        const user = await this.usersService.getUser(Number(dto.usuarioId)); // Usa el método con relaciones

        // 3. Extrae los datos del perfil (ajusta el nombre de las propiedades)
        const nombre = user.perfil.firstName;       // o 'nombre'
        const direccion = user.perfil.restaurant;    // si aplica
        const email = user.perfil.direction;            // el campo real de email
        const emailAdmin = "Cipxiaomi55@gmail.com"
        // 4. Valida el email
        if (!email) {
        throw new Error('El usuario no tiene email definido en su perfil');
        }

        // 5. Prepara el cuerpo del correo
        const bodyMsg = `Hola ${nombre}, tu solicitud de pedido fue registrada para ${direccion}.
        Cantidad Grano: ${dto.grano}
        Cantidad Molido: ${dto.molido}
        Fecha de entrega: ${dto.fechaEntrega}
        Notas adcionales: ${dto.notas}
        Te confirmaremos tu pedido en breve.`;

        const MsgAdmin = 
        `Solicitud de pedido creada favor de confirmarla para ${direccion}.
        Descripcion del pedido
        User:  ${dto.usuarioId}
        Cantidad Grano: ${dto.grano}
        Cantidad Molido: ${dto.molido}
        Fecha de entrega: ${dto.fechaEntrega}
        Notas: ${dto.notas}`

        // 6. Envía el correo
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


    @Get()
    findAll() {
        return this.solicitudesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.solicitudesService.findOne(Number(id));
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: updateSolicitudPedidoDto) {
        return this.solicitudesService.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.solicitudesService.remove(Number(id));
    }
}
