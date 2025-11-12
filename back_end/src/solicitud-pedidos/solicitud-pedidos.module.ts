// src/solicitud-pedidos/solicitud-pedidos.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudPedidosService } from './solicitud-pedidos.service';
import { SolicitudPedido } from './solicitud-pedido.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudPedido]),
    forwardRef(() => UsersModule), // <--- Importar módulo
  ],
  providers: [SolicitudPedidosService],
  exports: [SolicitudPedidosService],
})
export class SolicitudPedidosModule {}
