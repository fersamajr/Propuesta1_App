import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entity/User.entity';
import { createUserDto } from './dto/createUser.dto';
import { uptadeUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) {}

    async createPost(dto: createUserDto) {
        const userFound = await this.repo.findOne({ where: { username: dto.username } });
        if(userFound){
            return new HttpException("User already exits", HttpStatus.CONFLICT)
        }
        const newUser = this.repo.create(dto)
        return this.repo.save(newUser)
    }

    async update(id: string, dto: uptadeUserDto) {
        const usuario = await this.repo.findOne({ where: { id } });
        if (!usuario) throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }

    async findAll() { return this.repo.find({relations:["perfil","inventarioPersonal","inventario","pagos"]}); }

    async getUser(id: string) {
        const usuario = await this.repo.findOne({ where: { id }, relations:["perfil","inventarioPersonal"]});
        if (!usuario) throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        return usuario;
    }

    async delete(id: String) {
        const result = await this.repo.delete(id);
        if (result.affected === 0) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        return { deleted: true, id };
    }
    async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
    }

    async findById(id: string) {
    return this.repo.findOne({ where: { id } });
    }

    async create(userData: any) {
    const user = this.repo.create(userData);
    return this.repo.save(user);
}
}
