import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Usuario } from './User.entity';

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

    @Column({type: "datetime", nullable: true})
    fechaAnterior: Date;

    @OneToOne(()=> Usuario,usuario => usuario.inventarioPersonal)
    usuario: Usuario;
}
