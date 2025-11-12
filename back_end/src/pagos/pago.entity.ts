import { Entity , PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne} from "typeorm";
import { Usuario } from "src/users/entity/User.entity";

@Entity()
export class Pago {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.pagos)
    usuario: Usuario;

    @Column('float')
    cantidad: number;

    @Column("datetime")
    fecha: Date;
}


