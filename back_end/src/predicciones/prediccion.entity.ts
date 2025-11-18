// src/predicciones/prediccion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from 'src/users/entity/User.entity';
import { Pedido } from 'src/pedidos/pedido.entity';

@Entity('predicciones')
export class Prediccion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    usuarioId: string;

    @ManyToOne(() => Usuario, usuario => usuario.predicciones, { onDelete: 'CASCADE' })
    usuario: Usuario;

    @Column({ type: 'uuid', nullable: true })
    pedidoId: string;

    @OneToOne(() => Pedido, pedido => pedido.prediccion, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'pedidoId' })
    pedido: Pedido;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
