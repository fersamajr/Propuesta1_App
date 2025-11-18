// src/users/entities/profile.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Usuario } from './User.entity';

@Entity('perfiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    firstName: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    lastName: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    restaurant: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    direction: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    precioAcordado: number;

    @Column({ type: 'text', nullable: true })
    notas: string;

    // ✅ CAMBIO: FK ahora es UUID
    @Column({ type: 'uuid' })
    usuarioId: string;

    @OneToOne(() => Usuario, usuario => usuario.perfil)
    usuario: Usuario;
}
