import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { createInventarioPersonalDto } from '../dto/createInventarioPersonal.dto';
import { updateInventarioPersonalDto } from '../dto/updateInventarioPersonal.dto';
import { InventarioPersonalService } from './inventario-personal.service';

@Controller('inventario-personal')
export class InventarioPersonalController {
    constructor(private readonly service: InventarioPersonalService) {}

    @Get()
    getAll() {
        return this.service.findAll();
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.service.findOne(String(id));
    }

    @Post(':id')
    create(@Param('id') id: string, @Body() dto: createInventarioPersonalDto) {
        return this.service.create(String(id), dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: updateInventarioPersonalDto) {
        return this.service.update(String(id), dto);
    }
}
