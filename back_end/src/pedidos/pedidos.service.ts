import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { createPedidoDto } from './dto/createPedido.dto';
import { updatePedidoDto } from './dto/updatePedido.dto';
import { UsersService } from 'src/users/users.service';
import { SolicitudPedidosService } from 'src/solicitud-pedidos/solicitud-pedidos.service';
import { SolicitudPedido } from 'src/solicitud-pedidos/solicitud-pedido.entity';

@Injectable()
export class PedidosService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Pedido) private pedidosRepository: Repository<Pedido>,
        private solicitudService: SolicitudPedidosService,
        @InjectRepository(SolicitudPedido) private solicitudRepository: Repository<SolicitudPedido>,
    ) {}
    async createPedido(dto: createPedidoDto) {
    // Obtener usuario
    const user = await this.usersService.getUser(dto.usuarioId);
    if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    // Obtener solicitud
    const solicitudPedidoFound = await this.solicitudRepository.findOne({
        where: { id: dto.solicitudId },
        relations: ['pedido'] // Carga la relación para poder validar
    });
    if (!solicitudPedidoFound) {
        throw new HttpException("Solicitud not found", HttpStatus.NOT_FOUND);
    }

    // Validación extra: verifica que no haya ya un pedido para la solicitud
    if (solicitudPedidoFound.pedido) {
        throw new HttpException("La solicitud ya tiene un pedido asociado", HttpStatus.CONFLICT);
    }

    // Crear pedido y asociar usuario
    const newPedido = this.pedidosRepository.create({
        ...dto,
        usuario: user,
    });

    // Guardar pedido
    const savedPedido = await this.pedidosRepository.save(newPedido);

    // Asignar ambos lados de la relación
    solicitudPedidoFound.pedido = savedPedido;
    savedPedido.solicitudPedido = solicitudPedidoFound;

    // Guardar ambos objetos para asegurar la relación en la base de datos
    await this.pedidosRepository.save(savedPedido);
    await this.solicitudRepository.save(solicitudPedidoFound);

    // Retorna solo lo necesario para evitar problemas de referencia circular
    return { id: savedPedido.id, message: "Creado correctamente" };
    }
    async findAll() {
        return this.pedidosRepository.find({relations:["usuario","prediccion","solicitudPedido"]});
    }

    async findOne(id: number) {
        const pedido = await this.pedidosRepository.findOne({
        where: { id },
        relations: ["usuario","prediccion","solicitudPedido"],
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
    const pedido = await this.pedidosRepository.findOne({
        where: { id },
        relations: ['solicitudPedido']
    });
    if (!pedido) {
        throw new HttpException("Pedido not found", HttpStatus.NOT_FOUND);
    }

    // Si el pedido tiene referencia en solicitud, elimínala
    if (pedido.solicitudPedido) {
        pedido.solicitudPedido.pedido = null;
        await this.solicitudRepository.save(pedido.solicitudPedido);
    }

    // Ahora sí se puede borrar
    await this.pedidosRepository.delete(id);
    return { deleted: true, id };
    }

}
