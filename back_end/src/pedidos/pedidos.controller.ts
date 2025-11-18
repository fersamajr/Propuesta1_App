import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { createPedidoDto } from './dto/createPedido.dto';
import { updatePedidoDto } from './dto/updatePedido.dto';
import { PedidosService } from './pedidos.service';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';

@Controller('pedidos')
export class PedidosController {
    constructor(private pedidosService: PedidosService,
                private readonly mailService: MailService,
                private usersService: UsersService
    ) {}

    // en tu controller
    @Post()
    async createPedido(@Body() dto: createPedidoDto) {
    const pedido = await this.pedidosService.createPedido(dto);

    // Consulta al usuario con perfil ya incluido
    const user = await this.usersService.getUser(String(dto.usuarioId));

    // Obtén los datos del perfil
    const nombre = user.perfil.firstName;        // o 'nombre', según tu campo real
    const direccion = user.perfil.restaurant;     // o cualquier otro campo
    const email = user.perfil.direction;             // campo de email real

    // Cuerpo del mensaje
    const bodyMsg = `Hola ${nombre}, tu pedido fue registrado y se entregará a ${direccion}.`;
    console.log('Email destinatario:', email);
    // Envía el correo
    if (!email) {
    throw new Error('El usuario no tiene email definido en su perfil');
    }
    await this.mailService.sendMail(email, 'Confirmación de pedido', bodyMsg);

    return pedido;
    }



    @Get()
    async getPedidos() {
        const get = await this.pedidosService.findAll();
        return get
    }

    @Get(':id')
    getPedido(@Param('id') id: string) {
        return this.pedidosService.findOne(String(id));
    }

    @Patch(':id')
    updatePedido(@Param('id') id: string, @Body() dto: updatePedidoDto) {
        return this.pedidosService.update(String(id), dto);
    }

    @Delete(':id')
    removePedido(@Param('id') id: string) {
        return this.pedidosService.remove(String(id));
    }
}
