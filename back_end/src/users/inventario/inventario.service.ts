
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from '../entity/inventario.entity';
import { createInventarioDto } from '../dto/createInventario.dto';
import { updateInventarioDto } from '../dto/updateInventario.dto';

@Injectable()
export class InventarioService {
    constructor(@InjectRepository(Inventario) private repo: Repository<Inventario>) {}

    async create(id: number, dto: createInventarioDto) {
        const existe = await this.repo.findOne({ where: { id } });
        if (existe) throw new HttpException('Ya existe inventario para ese usuario', HttpStatus.CONFLICT);
        const nuevo = this.repo.create({ ...dto, id });
        return this.repo.save(nuevo);
    }

    async update(id: number, dto: updateInventarioDto) {
        const inventario = await this.repo.findOne({ where: { id } });
        if (!inventario) throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }

    async findAll() { return this.repo.find(); }

    async findOne(id: number) {
        const inventario = await this.repo.findOne({ where: { id } });
        if (!inventario) throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
        return inventario;
    }
}
