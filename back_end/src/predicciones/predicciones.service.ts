import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediccion } from './prediccion.entity';
import { createPrediccionDto } from './dto/createPrediccion.dto';
import { updatePrediccionDto } from './dto/updatePrediccion.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PrediccionesService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Prediccion) private prediccionesRepository: Repository<Prediccion>,
    ) {}

    async create(dto: createPrediccionDto) {
        const user = await this.usersService.getUser(dto.usuarioId);
        if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        const prediccion = this.prediccionesRepository.create({
        ...dto,
        usuario: user,
        });
        return this.prediccionesRepository.save(prediccion);
    }

    findAll() {
        return this.prediccionesRepository.find({ relations: ['usuario'] });
    }

    async findOne(id: number) {
        const prediccion = await this.prediccionesRepository.findOne({
        where: { id },
        relations: ['usuario'],
        });
        if (!prediccion) {
        throw new HttpException('Predicción no encontrada', HttpStatus.NOT_FOUND);
        }
        return prediccion;
    }

    async update(id: number, dto: updatePrediccionDto) {
        const prediccion = await this.prediccionesRepository.findOneBy({ id });
        if (!prediccion) {
        throw new HttpException('Predicción no encontrada', HttpStatus.NOT_FOUND);
        }
        Object.assign(prediccion, dto);
        return this.prediccionesRepository.save(prediccion);
    }

    async remove(id: number) {
        const prediccion = await this.prediccionesRepository.findOneBy({ id });
        if (!prediccion) {
        throw new HttpException('Predicción no encontrada', HttpStatus.NOT_FOUND);
        }
        await this.prediccionesRepository.delete(id);
        return { deleted: true, id };
    }
}
