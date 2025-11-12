import { Prediccion } from "src/predicciones/prediccion.entity";
import { SolicitudPedido } from "src/solicitud-pedidos/solicitud-pedido.entity";
import { Usuario } from "src/users/entity/User.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.pedidos)
    usuario: Usuario;

    // @OneToOne(()=> SolicitudPedido)
    // @JoinColumn()
    // solicitudId:SolicitudPedido;

    @Column({type: "datetime", nullable : true})
    fechaEntrega: Date;

    @Column({default : false})
    entregado: boolean;

    @Column({default : false})
    pagado: boolean;

    @OneToOne(()=> Prediccion)
    @JoinColumn()
    Prediccion :Prediccion;

    @Column({nullable : true})
    notas: string;
}

