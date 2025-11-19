import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { createPedidoDto } from './dto/createPedido.dto';
import { updatePedidoDto } from './dto/updatePedido.dto';
import { UsersService } from 'src/users/users.service';
import { SolicitudPedidosService } from 'src/solicitud-pedidos/solicitud-pedidos.service';
import { SolicitudPedido } from 'src/solicitud-pedidos/solicitud-pedido.entity';
import { Usuario } from 'src/users/entity/User.entity';
import { Prediccion } from 'src/predicciones/prediccion.entity';

@Injectable()
export class PedidosService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Pedido) private pedidosRepository: Repository<Pedido>,
        private solicitudService: SolicitudPedidosService,
        @InjectRepository(SolicitudPedido) private solicitudRepository: Repository<SolicitudPedido>,
        @InjectRepository(Prediccion) private prediccionRepo: Repository<Prediccion>,
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

    async findOne(id: string) {
        const pedido = await this.pedidosRepository.findOne({
        where: { id },
        relations: ["usuario","prediccion","solicitudPedido"],
        });
        if (!pedido) {
        throw new HttpException("Pedido not found", HttpStatus.NOT_FOUND);
        }
        return pedido;
    }

    async update(id: string, dto: updatePedidoDto) {
        const pedido = await this.pedidosRepository.findOneBy({ id });
        if (!pedido) {
        throw new HttpException("Pedido not found", HttpStatus.NOT_FOUND);
        }
        Object.assign(pedido, dto);
        return this.pedidosRepository.save(pedido);
    }

    async remove(id: string) {
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
    // 🆕 NUEVO MÉTODO: Encontrar pedidos por ID de usuario
    async findByUsuarioId(usuarioId: string) {
        return this.pedidosRepository.find({
            where: { usuarioId }, // Filtrar por el ID de usuario
            relations: ["usuario", "prediccion", "solicitudPedido"],
            order: { createdAt: 'DESC' }
        });
    }
async getAnalytics(usuarioId: string) {
        // --- 1. LÓGICA EXISTENTE (Historial) ---
        const pedidos = await this.pedidosRepository.find({
            where: { usuarioId, entregado: true },
            relations: ['solicitudPedido'],
            order: { createdAt: 'ASC' }
        });

        // ... (Tu lógica de acumulados existente se mantiene) ...
        let totalGrano = 0;
        let totalMolido = 0;
        const consumoPorMes = {}; // Para la gráfica de historial

        // NUEVO: Estructura para comparar años { "0": { 2023: 10, 2024: 12 } } (0 es Enero)
        const comparativaData = {}; 

        pedidos.forEach(p => {
            if (p.solicitudPedido) {
                const kg = (p.solicitudPedido.grano || 0) + (p.solicitudPedido.molido || 0);
                
                // Totales globales
                totalGrano += (p.solicitudPedido.grano || 0);
                totalMolido += (p.solicitudPedido.molido || 0);

                const fecha = new Date(p.createdAt);
                
                // Historial General (Mes/Año)
                const key = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
                consumoPorMes[key] = (consumoPorMes[key] || 0) + kg;

                // Lógica para Tabla Comparativa (Agrupar por Mes y Año)
                const mesIndex = fecha.getMonth(); // 0 = Enero
                const anio = fecha.getFullYear();
                
                if (!comparativaData[mesIndex]) comparativaData[mesIndex] = {};
                if (!comparativaData[mesIndex][anio]) comparativaData[mesIndex][anio] = 0;
                comparativaData[mesIndex][anio] += kg;
            }
        });

        // --- 2. NUEVA LÓGICA: Tabla Comparativa (Año Actual vs Anterior) ---
        const anioActual = new Date().getFullYear();
        const anioAnterior = anioActual - 1;
        const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        const tablaComparativa = Object.keys(comparativaData).map(mesIndex => {
            const datosMes = comparativaData[mesIndex];
            const actual = datosMes[anioActual] || 0;
            const anterior = datosMes[anioAnterior] || 0;
            
            // Calcular porcentaje de cambio
            let cambio = 0;
            if (anterior > 0) cambio = ((actual - anterior) / anterior) * 100;
            else if (actual > 0) cambio = 100; 

            return {
                mes: mesesNombres[mesIndex],
                anterior: anterior,
                actual: actual,
                cambio: cambio.toFixed(1) // Ej: "15.5"
            };
        }).sort((a, b) => mesesNombres.indexOf(a.mes) - mesesNombres.indexOf(b.mes));


        // --- 3. NUEVA LÓGICA: Predicciones (Próximos 3 meses) ---
        const hoy = new Date();
        const tresMesesDespues = new Date();
        tresMesesDespues.setMonth(hoy.getMonth() + 3);

        const prediccionesFuturas = await this.prediccionRepo.find({
            where: {
                usuarioId,
                fecha: Between(hoy, tresMesesDespues)
            },
            order: { fecha: 'ASC' }
        });

        // Agrupar predicciones por mes (pueden haber varias en un mes)
        const proyeccionMap = {};
        prediccionesFuturas.forEach(p => {
            const fechaP = new Date(p.fecha);
            const mesNombre = mesesNombres[fechaP.getMonth()];
            proyeccionMap[mesNombre] = (proyeccionMap[mesNombre] || 0) + p.cantidad;
        });

        const proyeccionGrafica = Object.keys(proyeccionMap).map(mes => ({
            mes,
            estimado: proyeccionMap[mes]
        }));

        // --- RETORNO DE DATOS ---
        return {
            resumenTotal: { grano: totalGrano, molido: totalMolido, total: totalGrano + totalMolido },
            historialConsumo: Object.keys(consumoPorMes).map(k => ({ mes: k, kg: consumoPorMes[k] })),
            comparativa: tablaComparativa, // ⬅️ Datos para la tabla
            proyeccion: proyeccionGrafica // ⬅️ Datos para la nueva gráfica
        };
    }
// 🆕 MÉTODO PARA EL DASHBOARD GLOBAL (KPIs + GRÁFICA)
    async getGlobalDashboardStats() {
        const hoy = new Date();
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        // 1. KPIs
        // A. Pedidos Pendientes
        const totalPendientes = await this.pedidosRepository.count({ where: { entregado: false } });

        // B. Ingresos del Mes (Consultamos Pedidos pagados o podrías consultar la tabla Pagos)
        // Para simplificar, contaremos pedidos marcados como 'pagado' creados este mes
        const pedidosDelMes = await this.pedidosRepository.find({
            where: { 
                createdAt: Between(primerDiaMes, hoy),
            },
            relations: ['solicitudPedido']
        });
        
        // C. Inventario Crítico (Necesitamos inyectar InventarioService o hacerlo directo si tenemos acceso)
        // Nota: Como estamos en PedidosService, haremos una consulta básica a usuarios para no crear dependencia circular compleja
        const usuariosConStockBajo = await this.usersService.findAll(); 
        const alertasStock = usuariosConStockBajo.filter(u => u.inventario && u.inventario.cantidad < 10).length;

        // 2. DATOS PARA GRÁFICA (Ventas últimos 6 meses)
        const seisMesesAtras = new Date();
        seisMesesAtras.setMonth(hoy.getMonth() - 5);
        seisMesesAtras.setDate(1);

        const historialPedidos = await this.pedidosRepository.find({
            where: { createdAt: Between(seisMesesAtras, hoy) },
            relations: ['solicitudPedido'],
            order: { createdAt: 'ASC' }
        });

        const graficaMap = {};
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        // Inicializar mapa
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(hoy.getMonth() - i);
            const key = meses[d.getMonth()];
            graficaMap[key] = 0;
        }

        historialPedidos.forEach(p => {
            if (p.solicitudPedido) {
                const mes = meses[new Date(p.createdAt).getMonth()];
                const kg = (p.solicitudPedido.grano || 0) + (p.solicitudPedido.molido || 0);
                if (graficaMap[mes] !== undefined) {
                    graficaMap[mes] += kg;
                }
            }
        });

        const chartData = Object.keys(graficaMap).reverse().map(mes => ({
            name: mes,
            kg: graficaMap[mes]
        }));

        return {
            kpis: {
                pendientes: totalPendientes,
                pedidosMes: pedidosDelMes.length, // O sumar dinero si tienes precios
                alertasStock
            },
            chartData
        };
    }
}
