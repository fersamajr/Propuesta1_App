import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from 'src/users/entity/User.entity';
@Entity()
export class Prediccion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.predicciones)
    usuario: Usuario;

    @Column('int')
    cantidad: number;

    @Column()
    fecha: Date;

    @Column({nullable : true})
    pedidoId: number;

    @Column({default:false})
    asociadaAPedido: boolean;
}
