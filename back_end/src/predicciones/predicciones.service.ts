import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediccion } from './prediccion.entity';
import { createPrediccionDto } from './dto/createPrediccion.dto';
import { updatePrediccionDto } from './dto/updatePrediccion.dto';
import { UsersService } from 'src/users/users.service';
import { Usuario } from 'src/users/entity/User.entity';
import { Pedido } from 'src/pedidos/pedido.entity';

@Injectable()
export class PrediccionesService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Prediccion) private prediccionesRepository: Repository<Prediccion>,
        @InjectRepository(Pedido) private pedidoRepo: Repository<Pedido>
    ) {}

    async create(dto: createPrediccionDto) {
        // Buscar el pedido por ID
        const pedido = await this.pedidoRepo.findOne({ where: { id: dto.pedidoId } });
        if (!pedido) {
            throw new Error("Pedido no existe");
        }

        // Buscar el usuario por ID
        const user = await this.usersService.getUser(dto.usuarioId);
        if (!user) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }

        // Crear la predicción a partir del DTO y el usuario encontrado
        const prediccion = this.prediccionesRepository.create({
            ...dto,
            usuario: user,
        });

        // Guardar primero la predicción
        const prediccionGuardada = await this.prediccionesRepository.save(prediccion);

        // Asociar la predicción guardada al pedido y guardar el pedido
        pedido.prediccion = prediccionGuardada;
        await this.pedidoRepo.save(pedido);

        // Retornar la predicción guardada
        return prediccionGuardada;
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
