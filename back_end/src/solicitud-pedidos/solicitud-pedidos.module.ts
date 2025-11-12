import { Module } from '@nestjs/common';
import { SolicitudPedidosService } from './solicitud-pedidos.service';

@Module({
  providers: [SolicitudPedidosService]
})
export class SolicitudPedidosModule {}
