import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudPedido } from './solicitud-pedido.entity';
import { createSolicitudPedidoDto } from './dto/createSolicitud-pedido.dto';
import { updateSolicitudPedidoDto } from './dto/updateSolicitud-pedido';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SolicitudPedidosService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(SolicitudPedido) private solicitudesRepo: Repository<SolicitudPedido>,
    ) {}

    async create(dto: createSolicitudPedidoDto) {
        const user = await this.usersService.getUser(dto.usuarioId);
        if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        const solicitud = this.solicitudesRepo.create({
        ...dto,
        usuario: user,
        });
        return this.solicitudesRepo.save(solicitud);
    }

    findAll() {
        return this.solicitudesRepo.find({ relations: ['usuario',"pedido"] });
    }

    async findOne(id: string) {
        const solicitud = await this.solicitudesRepo.findOne({
        where: { id },
        relations: ['usuario',"Pedido"],
        });
        if (!solicitud) {
        throw new HttpException('Solicitud-Pedido no encontrada', HttpStatus.NOT_FOUND);
        }
        return solicitud;
    }

    async update(id: string, dto: updateSolicitudPedidoDto) {
        const solicitud = await this.solicitudesRepo.findOneBy({ id });
        if (!solicitud) {
        throw new HttpException('Solicitud-Pedido no encontrada', HttpStatus.NOT_FOUND);
        }
        Object.assign(solicitud, dto);
        return this.solicitudesRepo.save(solicitud);
    }

    async remove(id: string) {
        const solicitud = await this.solicitudesRepo.findOneBy({ id });
        if (!solicitud) {
        throw new HttpException('Solicitud-Pedido no encontrada', HttpStatus.NOT_FOUND);
        }
        await this.solicitudesRepo.delete(id);
        return { deleted: true, id };
    }
}
