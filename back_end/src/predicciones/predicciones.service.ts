import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm'; // ⬅️ 1. IMPORTAR IsNull
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
        const pedido = await this.pedidoRepo.findOne({ where: { id: dto.pedidoId} });
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

    // 🆕 NUEVO MÉTODO: Encontrar predicciones por ID de usuario
    async findByUsuarioId(usuarioId: string) {
        return this.prediccionesRepository.find({
            where: { 
                usuarioId: usuarioId,
                pedidoId: IsNull() // ⬅️ 2. FILTRO CLAVE: Solo las que NO tienen pedido asociado
            },
            relations: ['usuario'],
            order: { createdAt: 'DESC' }
        });
    }

    findAll() {
        return this.prediccionesRepository.find({ relations: ['usuario'] });
    }

    async findOne(id: string) {
        const prediccion = await this.prediccionesRepository.findOne({
        where: { id },
        relations: ['usuario'],
        });
        if (!prediccion) {
        throw new HttpException('Predicción no encontrada', HttpStatus.NOT_FOUND);
        }
        return prediccion;
    }

    async update(id: string, dto: updatePrediccionDto) {
        const prediccion = await this.prediccionesRepository.findOneBy({ id });
        if (!prediccion) {
        throw new HttpException('Predicción no encontrada', HttpStatus.NOT_FOUND);
        }
        Object.assign(prediccion, dto);
        return this.prediccionesRepository.save(prediccion);
    }

    async remove(id: string) {
        const prediccion = await this.prediccionesRepository.findOneBy({ id });
        if (!prediccion) {
        throw new HttpException('Predicción no encontrada', HttpStatus.NOT_FOUND);
        }
        await this.prediccionesRepository.delete(id);
        return { deleted: true, id };
    }
    // 🆕 MÉTODO PARA ANÁLISIS DE DESVIACIÓN
    async getAnalisisDesviacion() {
        return this.prediccionesRepository.find({
            where: { 
                pedidoId: Not(IsNull()) // Solo las que ya se convirtieron en pedido
            },
            relations: [
                'usuario', 
                'usuario.perfil', // Para ver el nombre del restaurante
                'pedido', 
                'pedido.solicitudPedido' // Para ver cuánto pidieron realmente
            ],
            order: { fecha: 'DESC' }
        });
    }
    async getInventoryPlanning() {
        // 1. Buscar todas las predicciones que NO se han convertido en pedido
        const pendientes = await this.prediccionesRepository.find({
            where: { 
                pedidoId: IsNull() // Solo las pendientes
            },
            relations: ['usuario', 'usuario.perfil'], // Útil para ver quién lo necesitará (opcional en la vista)
            order: { fecha: 'ASC' }
        });

        // 2. Calcular Total Global
        const totalKgNecesarios = pendientes.reduce((acc, p) => acc + p.cantidad, 0);

        // 3. Agrupar por Semana/Mes para la gráfica (Lógica simple por Fecha exacta)
        // El frontend puede agrupar mejor, enviamos la lista limpia.
        return {
            totalKg: totalKgNecesarios,
            detalle: pendientes // Lista para graficar la demanda en el tiempo
        };
    }
}
