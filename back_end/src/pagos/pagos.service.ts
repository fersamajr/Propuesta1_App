import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './pago.entity';
import { createPagoDto } from './dto/CreatePago.dto';
import { updatePagoDto } from './dto/UpdatePago.dto';
import { UsersService } from 'src/users/users.service';
import { Usuario } from 'src/users/entity/User.entity';
import { Pedido } from 'src/pedidos/pedido.entity';

@Injectable()
export class PagosService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Pago) private pagosRepository: Repository<Pago>,
        @InjectRepository(Pedido) private pedidosRepo: Repository<Pedido>,
        @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    ) {}

    async createPago(dto: createPagoDto) {
        const user = await this.usersService.getUser(dto.usuarioId);
        if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        const pago = this.pagosRepository.create({
        ...dto,
        usuario: user,
        });
        return this.pagosRepository.save(pago);
    }

    findAll() {
        return this.pagosRepository.find({ relations: ['usuario'] });
    }

    async findOne(id: string) {
        const pago = await this.pagosRepository.findOne({
        where: { id },
        relations: ['usuario'],
        });
        if (!pago) {
        throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
        }
        return pago;
    }

    async update(id: string, dto: updatePagoDto) {
        const pago = await this.pagosRepository.findOneBy({ id });
        if (!pago) {
        throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
        }
        Object.assign(pago, dto);
        return this.pagosRepository.save(pago);
    }

    async remove(id: string) {
        const pago = await this.pagosRepository.findOneBy({ id });
        if (!pago) {
        throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
        }
        await this.pagosRepository.delete(id);
        return { deleted: true, id };
    }
    // 🆕 NUEVO MÉTODO: Encontrar pagos por ID de usuario
    async findByUsuarioId(usuarioId: string) {
        return this.pagosRepository.find({ 
            where: { usuarioId }, 
            relations: ['usuario'] 
        });
    }
    async getResumenFinanciero(usuarioId: string) {
        // 1. Obtener el perfil del usuario para saber el PRECIO ACORDADO
        const usuario = await this.usuarioRepo.findOne({ 
            where: { id: usuarioId },
            relations: ['perfil']
        });

        if (!usuario || !usuario.perfil) {
            throw new HttpException('Usuario o perfil no encontrado', HttpStatus.NOT_FOUND);
        }

        const precioPorKg = usuario.perfil.precioAcordado;

        // 2. Obtener todos los pedidos del usuario con sus solicitudes (para ver los kgs)
        const pedidos = await this.pedidosRepo.find({
            where: { usuarioId: usuarioId },
            relations: ['solicitudPedido']
        });

        // 3. Calcular el Total de Kilos y la Deuda Total Acumulada
        let totalKgConsumidos = 0;

        pedidos.forEach(pedido => {
            if (pedido.solicitudPedido) {
                // Sumamos grano + molido de cada pedido
                const kgGrano = pedido.solicitudPedido.grano || 0;
                const kgMolido = pedido.solicitudPedido.molido || 0;
                totalKgConsumidos += (kgGrano + kgMolido);
            }
        });

        const deudaTotalHistorica = totalKgConsumidos * precioPorKg;

        // 4. Obtener todos los pagos realizados por el usuario
        const pagos = await this.pagosRepository.find({
            where: { usuarioId: usuarioId },
            order: { fecha: 'DESC' } // Ordenar para obtener el último fácil
        });

        const totalPagado = pagos.reduce((acc, pago) => acc + pago.cantidad, 0);

        // 5. Calcular el Saldo Pendiente
        // (Lo que debería haber pagado en total - Lo que realmente ha pagado)
        const saldoPorPagar = deudaTotalHistorica - totalPagado;

        // 6. Calcular cuántos Kg representa ese dinero (regla de tres inversa)
        const kgPorPagar = precioPorKg > 0 ? (saldoPorPagar / precioPorKg) : 0;

        return {
            saldoPorPagar: saldoPorPagar > 0 ? saldoPorPagar : 0, // Evitar negativos si pagó de más
            kgPorPagar: kgPorPagar > 0 ? parseFloat(kgPorPagar.toFixed(2)) : 0,
            ultimoPago: pagos.length > 0 ? pagos[0] : null, // El más reciente
            precioAcordado: precioPorKg
        };
    }
}
