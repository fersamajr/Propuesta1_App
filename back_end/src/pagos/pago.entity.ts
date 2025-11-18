import { Entity , PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { Usuario } from "src/users/entity/User.entity";

@Entity()
export class Pago {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    cantidad: number;

    @Column("datetime")
    fecha: Date;

    @Column({ type: 'uuid' })
    usuarioId: string;

    @ManyToOne(() => Usuario, usuario => usuario.pagos, { onDelete: 'CASCADE' })
    usuario: Usuario;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}


