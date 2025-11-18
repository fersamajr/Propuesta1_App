// src/pedidos/pedido.entity.ts

import { Prediccion } from "src/predicciones/prediccion.entity";
import { SolicitudPedido } from "src/solicitud-pedidos/solicitud-pedido.entity";
import { Usuario } from "src/users/entity/User.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pedidos')
export class Pedido {
    // ✅ CAMBIO 1: UUID en lugar de INT
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // ✅ CAMBIO 2: FK a usuario ahora es UUID
    @Column({ type: 'uuid' })
    usuarioId: string;

    @ManyToOne(() => Usuario, usuario => usuario.pedidos, { 
        onDelete: 'CASCADE',
        eager: false 
    })
    usuario: Usuario;

    // ✅ CAMBIO 3: FK a solicitud pedido ahora es UUID
    @Column({ type: 'uuid', nullable: true })
    solicitudPedidoId: string;

    @OneToOne(() => SolicitudPedido, { 
        cascade: true, 
        onDelete: 'CASCADE',
        eager: false 
    })
    @JoinColumn({ name: 'solicitudPedidoId' })
    solicitudPedido: SolicitudPedido;

    @Column({ type: "datetime", nullable: true })
    fechaEntrega: Date;

    @Column({ type: 'boolean', default: false })
    entregado: boolean;

    @Column({ type: 'boolean', default: false })
    pagado: boolean;

    // ✅ CAMBIO 4: FK a prediccion ahora es UUID
    @Column({ type: 'uuid', nullable: true })
    prediccionId: string;

    @OneToOne(() => Prediccion, prediccion => prediccion.pedido, {
        cascade: true,
        onDelete: 'SET NULL',
        eager: false
    })
    @JoinColumn({ name: 'prediccionId' })
    prediccion: Prediccion;

    @Column({ type: 'text', nullable: true })
    notas: string;

    // ✅ CAMBIO 5: Timestamps automáticos para auditoría
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
