import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Usuario } from "./User.entity";


@Entity()
export class Inventario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('float')
    cantidad: number;

    @Column('float')
    ultimaCantidad: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    // ✅ CAMBIO: FK ahora es UUID
    @Column({ type: 'uuid' })
    usuarioId: string;

    @OneToOne(() => Usuario, usuario => usuario.inventario)
    usuario: Usuario;
}

