import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './pago.entity';
import { createPagoDto } from './dto/CreatePago.dto';
import { updatePagoDto } from './dto/UpdatePago.dto';
import { UsersService } from 'src/users/users.service';
import { rolUser, Usuario } from 'src/users/entity/User.entity';
import { Pedido } from 'src/pedidos/pedido.entity';

@Injectable()
export class PagosService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Pago) private pagosRepository: Repository<Pago>,
        @InjectRepository(Pedido) private pedidosRepo: Repository<Pedido>,
        @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    ) {}

    // --- CREAR PAGO ---
    async createPago(dto: createPagoDto) {
        const user = await this.usersService.getUser(dto.usuarioId);
        if (!user) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        const pago = this.pagosRepository.create({
            ...dto,
            usuario: user,
        });
        const pagoGuardado = await this.pagosRepository.save(pago);

        // ⚡ TRIGGER: Al crear pago, reconciliar deuda
        await this.reconciliarDeuda(dto.usuarioId);

        return pagoGuardado;
    }

    // --- ACTUALIZAR PAGO ---
    async update(id: string, dto: updatePagoDto) {
        const pago = await this.pagosRepository.findOne({ 
            where: { id }, 
            relations: ['usuario'] 
        });
        if (!pago) {
            throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
        }
        
        Object.assign(pago, dto);
        const pagoActualizado = await this.pagosRepository.save(pago);

        // ⚡ TRIGGER: Al editar pago, recalcular
        if (pago.usuario) {
            await this.reconciliarDeuda(pago.usuario.id);
        }

        return pagoActualizado;
    }

    // --- ELIMINAR PAGO ---
    async remove(id: string) {
        const pago = await this.pagosRepository.findOne({ 
            where: { id }, 
            relations: ['usuario'] 
        });

        if (!pago) {
            throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
        }
        
        const usuarioId = pago.usuario.id;
        await this.pagosRepository.delete(id);

        // ⚡ TRIGGER: Al borrar, recalcular (los pedidos pueden volver a pendiente)
        await this.reconciliarDeuda(usuarioId);

        return { deleted: true, id };
    }

    // =====================================================================
    // 🧠 LÓGICA FIFO: Conciliación Automática de Deuda
    // =====================================================================
    private async reconciliarDeuda(usuarioId: string) {
        // 1. Obtener Usuario y Precio
        const usuario = await this.usuarioRepo.findOne({
            where: { id: usuarioId },
            relations: ['perfil']
        });
        
        if (!usuario || !usuario.perfil) return; // Seguridad
        const precioPorKg = usuario.perfil.precioAcordado || 0;

        if (precioPorKg <= 0) return; // Sin precio no hay deuda calculable

        // 2. Sumar TODOS los Pagos Históricos ("La Bolsa")
        const todosLosPagos = await this.pagosRepository.find({ where: { usuarioId } });
        let bolsaDisponible = todosLosPagos.reduce((acc, p) => acc + p.cantidad, 0);

        // 3. Traer Pedidos (Del más VIEJO al más NUEVO)
        const pedidos = await this.pedidosRepo.find({
            where: { usuarioId },
            relations: ['solicitudPedido'],
            order: { createdAt: 'ASC' } // FIFO
        });

        const pedidosAActualizar: Pedido[] = [];

        // 4. Repartir el dinero
        for (const pedido of pedidos) {
            // Calcular costo del pedido actual
            const kilos = (pedido.solicitudPedido?.grano || 0) + (pedido.solicitudPedido?.molido || 0);
            const costoPedido = kilos * precioPorKg;

            if (costoPedido === 0) continue;

            let nuevoEstadoPagado = false;

            // Si hay dinero en la bolsa para cubrir este pedido (con margen de error flotante)
            if (bolsaDisponible >= costoPedido - 0.01) {
                nuevoEstadoPagado = true;
                bolsaDisponible -= costoPedido; // Restamos de la bolsa
            } else {
                nuevoEstadoPagado = false;
                bolsaDisponible = 0; // Se acabó el dinero
            }

            // Solo actualizamos si cambia el estado (optimización)
            if (pedido.pagado !== nuevoEstadoPagado) {
                pedido.pagado = nuevoEstadoPagado;
                pedidosAActualizar.push(pedido);
            }
        }

        // 5. Guardar cambios masivos
        if (pedidosAActualizar.length > 0) {
            await this.pedidosRepo.save(pedidosAActualizar);
            console.log(`✅ Conciliación: ${pedidosAActualizar.length} pedidos actualizados para ${usuario.username}`);
        }
    }

    // =====================================================================
    // 📊 MÉTODOS ESTÁNDAR Y REPORTES (Saldos)
    // =====================================================================

    findAll() {
        return this.pagosRepository.find({ relations: ['usuario'] });
    }

    async findOne(id: string) {
        const pago = await this.pagosRepository.findOne({
            where: { id },
            relations: ['usuario'],
        });
        if (!pago) throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
        return pago;
    }

    async findByUsuarioId(usuarioId: string) {
        return this.pagosRepository.find({ 
            where: { usuarioId }, 
            relations: ['usuario'] 
        });
    }

    // Usado por el Panel de Saldos
    async getResumenFinanciero(usuarioId: string) {
        const usuario = await this.usuarioRepo.findOne({ 
            where: { id: usuarioId },
            relations: ['perfil']
        });
        const precioPorKg = usuario?.perfil?.precioAcordado || 0;

        const pedidos = await this.pedidosRepo.find({
            where: { usuarioId: usuarioId },
            relations: ['solicitudPedido']
        });

        let totalKgConsumidos = 0;
        let ultimaFechaEntrega: Date | null = null;

        pedidos.forEach(pedido => {
            if (pedido.solicitudPedido) {
                totalKgConsumidos += (pedido.solicitudPedido.grano || 0) + (pedido.solicitudPedido.molido || 0);
            }
            if (pedido.fechaEntrega) {
                const fechaP = new Date(pedido.fechaEntrega);
                if (!ultimaFechaEntrega || fechaP > ultimaFechaEntrega) {
                    ultimaFechaEntrega = fechaP;
                }
            }
        });

        const deudaTotalHistorica = totalKgConsumidos * precioPorKg;

        const pagos = await this.pagosRepository.find({
            where: { usuarioId: usuarioId },
            order: { fecha: 'DESC' }
        });
        const totalPagado = pagos.reduce((acc, pago) => acc + pago.cantidad, 0);

        const saldoPorPagar = deudaTotalHistorica - totalPagado;
        const kgPorPagar = precioPorKg > 0 ? (saldoPorPagar / precioPorKg) : 0;

        return {
            saldoPorPagar: saldoPorPagar > 0 ? saldoPorPagar : 0,
            kgPorPagar: kgPorPagar > 0 ? parseFloat(kgPorPagar.toFixed(2)) : 0,
            ultimoPago: pagos.length > 0 ? pagos[0] : null,
            ultimaEntrega: ultimaFechaEntrega,
            precioAcordado: precioPorKg
        };
    }

    async getBalancesGlobales() {
        const clientes = await this.usuarioRepo.find({
            where: { rol: rolUser.cliente },
            relations: ['perfil']
        });

        const balances = await Promise.all(clientes.map(async (cliente) => {
            const resumen = await this.getResumenFinanciero(cliente.id);
            return {
                cliente: {
                    id: cliente.id,
                    username: cliente.username,
                    email: cliente.email,
                    negocio: cliente.perfil?.restaurant || 'Sin nombre',
                    contacto: cliente.perfil?.firstName ? `${cliente.perfil.firstName} ${cliente.perfil.lastName}` : ''
                },
                ...resumen
            };
        }));

        return balances.sort((a, b) => b.saldoPorPagar - a.saldoPorPagar);
    }
}