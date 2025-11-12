import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioPersonal } from '../entity/inventarioPersonal.entity';
import { createInventarioPersonalDto } from '../dto/createInventarioPersonal.dto';
import { updateInventarioPersonalDto } from '../dto/updateInventarioPersonal.dto';

@Injectable()
export class InventarioPersonalService {
    constructor(@InjectRepository(InventarioPersonal) private repo: Repository<InventarioPersonal>) {}

    async create(id: number, dto: createInventarioPersonalDto) {
        // Una sola entidad por usuario, lógica de unicidad aquí si se requiere
        const existe = await this.repo.findOne({ where: { id } });
        if (existe) throw new HttpException('Ya existe InventarioPersonal para ese usuario', HttpStatus.CONFLICT);
        const nuevo = this.repo.create({ ...dto, id });
        return this.repo.save(nuevo);
    }

    async update(id: number, dto: updateInventarioPersonalDto) {
        const encontrado = await this.repo.findOne({ where: { id } });
        if (!encontrado) throw new HttpException('InventarioPersonal no encontrado', HttpStatus.NOT_FOUND);
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }

    async findAll() {
        return this.repo.find();
    }

    async findOne(id: number) {
        const encontrado = await this.repo.findOne({ where: { id } });
        if (!encontrado) throw new HttpException('InventarioPersonal no encontrado', HttpStatus.NOT_FOUND);
        return encontrado;
    }
}
