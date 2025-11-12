import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Inventario } from "./inventario.entity";
import { Pedido } from 'src/pedidos/pedido.entity';
import { Pago } from 'src/pagos/pago.entity';
import { LogCambios } from 'src/logs/log.entity';
import { Prediccion } from 'src/predicciones/prediccion.entity';
import { InventarioPersonal } from './inventarioPersonal.entity';
import { SolicitudPedido } from 'src/solicitud-pedidos/solicitud-pedido.entity';

export enum rolUser{
    admin= 'Admin',
    cliente = "Cliente"
}

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique : true})
    username: string;

    @Column()
    contrasena: string;

    @Column({type : 'datetime', default : () => 'CURRENT_TIMESTAMP'})
    createdAt : Date

    @Column({default : rolUser.cliente})
    rol: rolUser;

    @OneToOne(() => Profile)
    @JoinColumn()
    perfil: Profile;

    @OneToOne(() => Inventario)
    inventario: Inventario;

    @OneToOne(() => InventarioPersonal)
    inventarioPersonal: InventarioPersonal;

    @OneToMany(() => Pedido, pedido => pedido.usuario)
    pedidos: Pedido[];
    
    @OneToMany(()=> SolicitudPedido, solicitudPedido => solicitudPedido.usuario)
    solicitudesPedidos : SolicitudPedido[]; 

    @OneToMany(() => Pago, pago => pago.usuario)
    pagos: Pago[];

    @OneToMany(() => LogCambios, log => log.usuario)
    logs: LogCambios[];

    @OneToMany(() => Prediccion, prediccion => prediccion.usuario)
    predicciones: Prediccion[];
}
