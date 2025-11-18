// src/solicitud-pedidos/solicitud-pedido.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "src/users/entity/User.entity";
import { Pedido } from "src/pedidos/pedido.entity";

@Entity('solicitudes_pedidos')
export class SolicitudPedido {
    // ✅ CAMBIO 1: UUID en lugar de INT
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // ✅ CAMBIO 2: FK a usuario ahora es UUID
    @Column({ type: 'uuid' })
    usuarioId: string;

    @ManyToOne(() => Usuario, usuario => usuario.solicitudesPedidos, {
        onDelete: 'CASCADE',
        eager: false
    })
    usuario: Usuario;

    @Column({ type: 'int', nullable: true })
    grano: number;

    @Column({ type: 'int', nullable: true })
    molido: number;

    // ✅ CAMBIO 3: Usar @CreateDateColumn() en lugar de Column con default
    @CreateDateColumn()
    fechaPedido: Date;

    @Column({ type: "datetime", nullable: true })
    fechaEntrega: Date;

    @Column({ type: 'text', nullable: true })
    notas: string;

    @Column({ type: 'boolean', default: false })
    entregado: boolean;

    @Column({ type: 'boolean', default: false })
    confirmado: boolean;

    // ✅ CAMBIO 4: FK a pedido ahora es UUID
    @Column({ type: 'uuid', nullable: true })
    pedidoId: string;

    @OneToOne(() => Pedido, pedido => pedido.solicitudPedido, {
        onDelete: 'CASCADE',
        eager: false
    })
    @JoinColumn({ name: 'pedidoId' })
    pedido: Pedido | null;

    // ✅ CAMBIO 5: Timestamps automáticos para auditoría
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
