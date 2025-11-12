import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entity/User.entity';
import { createUserDto } from './dto/createUser.dto';
import { uptadeUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) {}

    async create(id: number, dto: createUserDto) {
        const existe = await this.repo.findOne({ where: { id } });
        if (existe) throw new HttpException('Ya existe usuario con ese id', HttpStatus.CONFLICT);
        const nuevo = this.repo.create({ ...dto, id });
        return this.repo.save(nuevo);
    }

    async update(id: number, dto: uptadeUserDto) {
        const usuario = await this.repo.findOne({ where: { id } });
        if (!usuario) throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }

    async findAll() { return this.repo.find(); }

    async findOne(id: number) {
        const usuario = await this.repo.findOne({ where: { id } });
        if (!usuario) throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        return usuario;
    }

    async delete(id: number) {
        const result = await this.repo.delete(id);
        if (result.affected === 0) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        return { deleted: true, id };
    }
}
