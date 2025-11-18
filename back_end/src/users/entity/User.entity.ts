// src/users/entities/usuario.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Inventario } from "./inventario.entity";
import { Pedido } from 'src/pedidos/pedido.entity';
import { Pago } from 'src/pagos/pago.entity';
import { LogCambios } from 'src/logs/log.entity';
import { Prediccion } from 'src/predicciones/prediccion.entity';
import { InventarioPersonal } from './inventarioPersonal.entity';
import { SolicitudPedido } from 'src/solicitud-pedidos/solicitud-pedido.entity';

export enum rolUser {
    admin = 'Admin',
    cliente = 'Cliente'
}

@Entity('usuarios')
export class Usuario {
    // ✅ CAMBIO 1: UUID en lugar de INT
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // ✅ CAMBIO 2: Agregar email (requerido para auth)
    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    // ✅ CAMBIO 3: Renombrar a 'password' (estándar en auth)
    @Column({ type: 'varchar', length: 255 })
    password: string;  // ← Hash de bcrypt

    // ✅ CAMBIO 4: Cambiar tipo de rol a string
    @Column({ type: 'enum', enum: rolUser, default: rolUser.cliente })
    rol: rolUser;

    // ✅ CAMBIO 5: Agregar isActive para control de usuarios
    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    // ✅ CAMBIO 6: Usar CreateDateColumn en lugar de Column con default
    @CreateDateColumn()
    createdAt: Date;

    // ✅ CAMBIO 7: Agregar updatedAt para auditoría
    @UpdateDateColumn()
    updatedAt: Date;

    // ==================== RELACIONES ====================

    @OneToOne(() => Profile, profile => profile.usuario, { cascade: true, nullable: true })
    @JoinColumn()
    perfil: Profile;

    @OneToOne(() => Inventario, inventario => inventario.usuario, { cascade: true, nullable: true })
    @JoinColumn()
    inventario: Inventario;

    @OneToOne(() => InventarioPersonal, inventarioPersonal => inventarioPersonal.usuario, { cascade: true, nullable: true })
    @JoinColumn()
    inventarioPersonal: InventarioPersonal;

    @OneToMany(() => Pedido, pedido => pedido.usuario, { cascade: true })
    pedidos: Pedido[];

    @OneToMany(() => SolicitudPedido, solicitudPedido => solicitudPedido.usuario, { cascade: true })
    solicitudesPedidos: SolicitudPedido[];

    @OneToMany(() => Pago, pago => pago.usuario, { cascade: true })
    pagos: Pago[];

    @OneToMany(() => LogCambios, log => log.usuario, { cascade: true })
    logs: LogCambios[];

    @OneToMany(() => Prediccion, prediccion => prediccion.usuario, { cascade: true })
    predicciones: Prediccion[];
}
