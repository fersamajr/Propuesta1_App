import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


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
}

