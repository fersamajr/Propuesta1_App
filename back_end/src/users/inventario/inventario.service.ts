
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from '../entity/inventario.entity';
import { createInventarioDto } from '../dto/createInventario.dto';
import { updateInventarioDto } from '../dto/updateInventario.dto';
import { Usuario } from '../entity/User.entity';

@Injectable()
export class InventarioService {
    constructor(@InjectRepository(Inventario) private repo: Repository<Inventario>,
                    @InjectRepository(Usuario) private userRepo: Repository<Usuario>) {}

    async create(userId: number, dto: createInventarioDto) {
        const usuario = await this.userRepo.findOne({ where: { id: userId } });
        if (!usuario) throw new Error("Usuario no existe");

        // 1. Crear y guardar el inventario
        const nuevoInventario = this.repo.create(dto);
        await this.repo.save(nuevoInventario);

        // 2. Relacionar usuario y inventario
        usuario.inventario = nuevoInventario;
        await this.userRepo.save(usuario);

        return nuevoInventario;
    }
    

async update(id: number, dto: updateInventarioDto) {
    const inventario = await this.repo.findOne({ where: { id } });
    if (!inventario) throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);

    // Validar que el DTO no esté vacío
    if (!dto || Object.keys(dto).length === 0) {
        throw new HttpException('No se proporcionaron campos a actualizar', HttpStatus.BAD_REQUEST);
    }

    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
}


    async findAll() { 
        return this.repo.find({relations: ["usuario"]}); 
    }

    async findOne(id: number) {
        const inventario =  await this.repo.findOne({ where: { id }, relations:["usuario"]});
        if (!inventario) throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
        return inventario;
    }
}
