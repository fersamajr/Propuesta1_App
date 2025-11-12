import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { UsersModule } from '../users/users.module'; 
import { PedidosService } from 'src/pedidos/pedidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './pago.entity'; // Cambia el nombre si tu entidad se llama diferente


@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Pago]) // <-- agrega tu entidad aquí
  ],
  controllers: [PagosController],
  providers: [PagosService]
})
export class PagosModule {}
