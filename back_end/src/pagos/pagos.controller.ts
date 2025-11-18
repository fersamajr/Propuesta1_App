import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { createPagoDto } from './dto/CreatePago.dto';
import { updatePagoDto } from './dto/UpdatePago.dto';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosService: PagosService) {}

    @Post()
    createPago(@Body() dto: createPagoDto) {
        return this.pagosService.createPago(dto);
    }

    @Get()
    getPagos() {
        return this.pagosService.findAll();
    }

    @Get(':id')
    getPago(@Param('id') id: string) {
        return this.pagosService.findOne(String(id));
    }

    @Patch(':id')
    updatePago(@Param('id') id: string, @Body() dto: updatePagoDto) {
        return this.pagosService.update(String(id), dto);
    }

    @Delete(':id')
    removePago(@Param('id') id: string) {
        return this.pagosService.remove(String(id));
    }
}
