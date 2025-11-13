import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Usuario } from "./User.entity";


@Entity()
export class Inventario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    cantidad: number;

    @Column('float')
    ultimaCantidad: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(()=> Usuario,usuario => usuario.inventario)
    usuario: Usuario;
}

