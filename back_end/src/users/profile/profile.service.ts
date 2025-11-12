import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entity/profile.entity';
import { createProfileDto } from '../dto/createProfile.dto';
import { updateProfileDto } from '../dto/updateProfile.dto';

@Injectable()
export class ProfileService {
    constructor(@InjectRepository(Profile) private repo: Repository<Profile>) {}

    async create(id: number, dto: createProfileDto) {
        const existe = await this.repo.findOne({ where: { id } });
        if (existe) throw new HttpException('Ya existe profile para ese usuario', HttpStatus.CONFLICT);
        const nuevo = this.repo.create({ ...dto, id });
        return this.repo.save(nuevo);
    }

    async update(id: number, dto: updateProfileDto) {
        const perfil = await this.repo.findOne({ where: { id } });
        if (!perfil) throw new HttpException('Profile no encontrada', HttpStatus.NOT_FOUND);
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }

    async findAll() { return this.repo.find(); }

    async findOne(id: number) {
        const perfil = await this.repo.findOne({ where: { id } });
        if (!perfil) throw new HttpException('Profile no encontrada', HttpStatus.NOT_FOUND);
        return perfil;
    }
}
