
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

    async create(userId: string, dto: createInventarioDto) {
        const usuario = await this.userRepo.findOne({ where: { id: userId } });
        if (!usuario) throw new Error("Usuario no existe");

        // Crear inventario asignando explícitamente usuarioId para evitar error SQL
        const nuevoInventario = this.repo.create({
            ...dto,
            usuarioId: userId,
        });
        await this.repo.save(nuevoInventario);

        // Actualizar la relación en usuario
        usuario.inventario = nuevoInventario;
        await this.userRepo.save(usuario);

        return nuevoInventario;
    }

    
    async updateByUsuarioId(usuarioId: string, dto: updateInventarioDto) {
    const inventario = await this.repo.findOne({ where: { usuarioId } });
    if (!inventario) throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);

    // Evitar actualizar usuarioId accidentalmente
    if ('usuarioId' in dto) {
        delete dto.usuarioId;
    }

    if (!dto || Object.keys(dto).length === 0) {
        throw new HttpException('No se proporcionaron campos a actualizar', HttpStatus.BAD_REQUEST);
    }

    await this.repo.update(inventario.id, dto);
    return this.repo.findOne({ where: { id: inventario.id } });
    }




    async findAll() { 
        return this.repo.find({relations: ["usuario"]}); 
    }

    async findByUsuarioId(usuarioId: string) {
    const inventario = await this.repo.findOne({ where: { usuarioId }, relations: ['usuario'] });
    if (!inventario) throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    return inventario;
    }
}
