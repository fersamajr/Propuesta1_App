import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { createInventarioDto } from '../dto/createInventario.dto';
import { updateInventarioDto } from '../dto/updateInventario.dto';
import { InventarioService } from './inventario.service';

@Controller('inventario')
export class InventarioController {
    constructor(private readonly service: InventarioService) {}

    @Get()
    getAll() { return this.service.findAll(); }

    @Get(':id')
    getById(@Param('id') id: number) { return this.service.findOne(Number(id)); }

    @Post(':id')
    create(@Param('id') id: number, @Body() dto: createInventarioDto) {
        return this.service.create(Number(id), dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: updateInventarioDto) {
        return this.service.update(Number(id), dto);
    }
}
