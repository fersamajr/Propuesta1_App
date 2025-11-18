import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Usuario } from './User.entity';

@Entity()
export class InventarioPersonal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    // ✅ CAMBIO: FK ahora es UUID
    @Column({ type: 'uuid' })
    usuarioId: string;

    @OneToOne(() => Usuario, usuario => usuario.inventarioPersonal)
    usuario: Usuario;
}
