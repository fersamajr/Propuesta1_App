import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { UsersModule } from '../users/users.module'; 
import { PedidosService } from 'src/pedidos/pedidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './pago.entity'; // Cambia el nombre si tu entidad se llama diferente
import { Pedido } from 'src/pedidos/pedido.entity'; // ⬅️ IMPORTAR
import { Usuario } from 'src/users/entity/User.entity'; // ⬅️ IMPORTAR

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Pago, Pedido, Usuario])
  ],
  controllers: [PagosController],
  providers: [PagosService]
})
export class PagosModule {}
