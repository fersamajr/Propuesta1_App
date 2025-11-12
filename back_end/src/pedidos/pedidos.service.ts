import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { createPedidoDto } from './dto/createPedido.dto';
import { updatePedidoDto } from './dto/updatePedido.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PedidosService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Pedido) private pedidosRepository: Repository<Pedido>,
    ) {}

    async createPedido(dto: createPedidoDto) {
        // Verificamos la existencia del usuario antes de crear pedido
        const user = await this.usersService.getUser(dto.usuarioId);
        if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        const pedido = this.pedidosRepository.create(dto);
        return this.pedidosRepository.save(pedido);
    }

    async findAll() {
        return this.pedidosRepository.find();
    }

    async findOne(id: number) {
        const pedido = await this.pedidosRepository.findOne({
        where: { id },
        relations: ["user"],
        });
        if (!pedido) {
        throw new HttpException("Pedido not found", HttpStatus.NOT_FOUND);
        }
        return pedido;
    }

    async update(id: number, dto: updatePedidoDto) {
        const pedido = await this.pedidosRepository.findOneBy({ id });
        if (!pedido) {
        throw new HttpException("Pedido not found", HttpStatus.NOT_FOUND);
        }
        Object.assign(pedido, dto);
        return this.pedidosRepository.save(pedido);
    }

    async remove(id: number) {
        const pedido = await this.pedidosRepository.findOneBy({ id });
        if (!pedido) {
        throw new HttpException("Pedido not found", HttpStatus.NOT_FOUND);
        }
        await this.pedidosRepository.delete(id);
        return { deleted: true, id };
    }
}
