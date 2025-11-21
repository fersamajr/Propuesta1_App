// src/logs/log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from 'src/users/entity/User.entity';

@Entity('logs')
export class LogCambios {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tus columnas aquí...

    @Column({ type: 'uuid' })
    usuarioId: string;

    @ManyToOne(() => Usuario, usuario => usuario.logs, { onDelete: 'CASCADE' })
    usuario: Usuario;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
