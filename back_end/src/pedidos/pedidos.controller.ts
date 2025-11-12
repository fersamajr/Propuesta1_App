import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { createPedidoDto } from './dto/createPedido.dto';
import { updatePedidoDto } from './dto/updatePedido.dto';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
    constructor(private pedidosService: PedidosService) {}

    @Post(":id")
    createPedido(@Param("id",ParseIntPipe)id :number,@Body() dto: createPedidoDto) {
        return this.pedidosService.createPedido(id,dto);
    }

    @Get()
    getPedidos() {
        return this.pedidosService.findAll();
    }

    @Get(':id')
    getPedido(@Param('id') id: number) {
        return this.pedidosService.findOne(Number(id));
    }

    @Patch(':id')
    updatePedido(@Param('id') id: number, @Body() dto: updatePedidoDto) {
        return this.pedidosService.update(Number(id), dto);
    }

    @Delete(':id')
    removePedido(@Param('id') id: number) {
        return this.pedidosService.remove(Number(id));
    }
}
