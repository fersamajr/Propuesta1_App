import { Entity , PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany} from "typeorm";
import { Usuario } from "./User.entity";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique : true})
    firstname: string;

    @Column({unique : true})
    lastname: string;

    @Column({unique : true})
    restaurante: string;

    @Column()
    direccion: string;

    @Column('float')
    precioAcordado: number;

    @Column({nullable:true})
    notas: string;
}
