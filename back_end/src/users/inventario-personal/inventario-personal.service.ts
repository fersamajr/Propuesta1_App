import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioPersonal } from '../entity/inventarioPersonal.entity';
import { createInventarioPersonalDto } from '../dto/createInventarioPersonal.dto';
import { updateInventarioPersonalDto } from '../dto/updateInventarioPersonal.dto';
import { Usuario } from '../entity/User.entity';

@Injectable()
export class InventarioPersonalService {
    constructor(@InjectRepository(InventarioPersonal) private repo: Repository<InventarioPersonal>,
                @InjectRepository(Usuario) private userRepo: Repository<Usuario>) {}

    async create(userId: string, dto: createInventarioPersonalDto) {
        const usuario = await this.userRepo.findOne({ where: { id: userId } });
        if (!usuario) throw new Error("Usuario no existe");

        // 1. Crear y guardar el inventario
        const nuevoInventario = this.repo.create(dto);
        await this.repo.save(nuevoInventario);

        // 2. Relacionar usuario y inventario
        usuario.inventarioPersonal = nuevoInventario;
        await this.userRepo.save(usuario);

        return nuevoInventario;
    }

    async update(id: string, dto: updateInventarioPersonalDto) {
        const encontrado = await this.repo.findOne({ where: { id } });
        if (!encontrado) throw new HttpException('InventarioPersonal no encontrado', HttpStatus.NOT_FOUND);
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }

    async findAll() {
        return this.repo.find({relations: ["usuario"]}); 
    }

    async findOne(id: string) {
        const encontrado = await this.repo.findOne({ where: { id }, relations:["usuario"]});
        if (!encontrado) throw new HttpException('InventarioPersonal no encontrado', HttpStatus.NOT_FOUND);
        return encontrado;
    }
}
