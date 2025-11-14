import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Usuario } from 'src/users/entity/User.entity';
import { Pedido } from 'src/pedidos/pedido.entity';
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

    @Column({default:false})
    asociadaAPedido: boolean;

    @OneToOne(()=> Pedido,pedido => pedido.prediccion)
    pedido: Pedido;
}
