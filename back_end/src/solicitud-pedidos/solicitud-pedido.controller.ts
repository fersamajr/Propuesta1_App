import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { createSolicitudPedidoDto } from './dto/createSolicitud-pedido.dto';
import { updateSolicitudPedidoDto } from './dto/updateSolicitud-pedido';
import { SolicitudPedidosService } from './solicitud-pedidos.service';

@Controller('solicitud-pedidos')
export class SolicitudPedidosController {
    constructor(private readonly solicitudesService: SolicitudPedidosService) {}

    @Post()
    create(@Body() dto: createSolicitudPedidoDto) {
        return this.solicitudesService.create(dto);
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
