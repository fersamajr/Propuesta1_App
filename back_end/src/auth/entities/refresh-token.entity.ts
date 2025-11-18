// src/auth/entities/refresh-token.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    usuarioId: string;

    @Column({ type: 'text' })
    token: string;

    @Column({ type: 'datetime' })
    expiresAt: Date;

    @Column({ type: 'boolean', default: false })
    isRevoked: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
