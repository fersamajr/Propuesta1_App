import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class InventarioPersonal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    producto: string;

    @Column('float')
    cantidad: number;

    @Column('float')
    cantidadAnterior: number;

    @Column({type : 'datetime', default : () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date

    @Column("datetime")
    fechaAnterior: Date;
}
