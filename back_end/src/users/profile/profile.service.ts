import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entity/profile.entity';
import { createProfileDto } from '../dto/createProfile.dto';
import { updateProfileDto } from '../dto/updateProfile.dto';
import { Usuario } from '../entity/User.entity';

@Injectable()
export class ProfileService {
    constructor(@InjectRepository(Profile) private repo: Repository<Profile>,
                @InjectRepository(Usuario) private userRepo: Repository<Usuario>) {}

    async create(userId: string, dto: createProfileDto) {
        const usuario = await this.userRepo.findOne({ where: { id: userId } });
        if (!usuario) throw new Error("Usuario no existe");

        // 1. Crear y guardar el perfil
        const nuevoPerfil = this.repo.create(dto);
        await this.repo.save(nuevoPerfil);

        // 2. Relacionar usuario y perfil
        usuario.perfil = nuevoPerfil;
        await this.userRepo.save(usuario);

        return nuevoPerfil;
    }


    async update(id: string, dto: updateProfileDto) {
        const perfil = await this.repo.findOne({ where: { id } });
        if (!perfil) throw new HttpException('Profile no encontrada', HttpStatus.NOT_FOUND);
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }

    async findAll() {
        return this.repo.find({relations: ["usuario"]}); 
    }

    async findOne(id: string) {
        const perfil = await this.repo.findOne({ where: { id }, relations:["usuario"]});
        if (!perfil) throw new HttpException('Profile no encontrada', HttpStatus.NOT_FOUND);
        return perfil;
    }
}
