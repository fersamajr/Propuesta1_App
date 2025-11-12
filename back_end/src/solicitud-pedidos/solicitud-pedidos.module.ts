// src/solicitud-pedidos/solicitud-pedidos.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudPedidosService } from './solicitud-pedidos.service';
import { SolicitudPedido } from './solicitud-pedido.entity';
import { UsersModule } from '../users/users.module';
import { SolicitudPedidosController } from './solicitud-pedido.controller';
import { PedidosModule } from 'src/pedidos/pedidos.module';
import { PedidosController } from 'src/pedidos/pedidos.controller';

@Module({
  imports: [
  TypeOrmModule.forFeature([SolicitudPedido]),
  forwardRef(() => UsersModule),
  forwardRef(() => SolicitudPedidosModule), // Importa el otro módulo relacionado, si hay dependencia circular

  ],
  controllers: [SolicitudPedidosController],
  providers: [SolicitudPedidosService],
  exports: [SolicitudPedidosService],
})
export class SolicitudPedidosModule {}
