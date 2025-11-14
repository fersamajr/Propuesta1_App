import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './pedido.entity';
import { UsersModule } from '../users/users.module';
import { SolicitudPedidosModule } from '../solicitud-pedidos/solicitud-pedidos.module';
import { SolicitudPedido } from 'src/solicitud-pedidos/solicitud-pedido.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, SolicitudPedido]), // Ambas entidades
    forwardRef(() => UsersModule),
    forwardRef(() => SolicitudPedidosModule),
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService,PedidosModule],
})
export class PedidosModule {}
