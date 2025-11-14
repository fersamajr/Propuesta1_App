import { Entity , PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne} from "typeorm";
import { Usuario } from "src/users/entity/User.entity";
import { Pedido } from "src/pedidos/pedido.entity";

@Entity()
export class SolicitudPedido {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @Column({nullable : true})
    grano: number;

    @Column({nullable : true})
    molido: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fechaPedido: Date;

    @Column({type: "datetime", nullable : true})
    fechaEntrega: Date;

    @Column({nullable : true})
    notas: string;

    @Column({ default: false })
    entregado: boolean;

    @Column({ default: false })
    confirmado: boolean;

    @OneToOne(() => Pedido, { onDelete: 'CASCADE' })
    @JoinColumn()
    pedido: Pedido | null;

}
