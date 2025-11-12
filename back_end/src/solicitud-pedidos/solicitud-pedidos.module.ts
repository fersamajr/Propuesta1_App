import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudPedidosService } from './solicitud-pedidos.service';
import { SolicitudPedido } from './solicitud-pedido.entity'; // Ajusta el nombre y path de la entidad si cambia

@Module({
  imports: [TypeOrmModule.forFeature([SolicitudPedido])],
  providers: [SolicitudPedidosService],
  exports: [SolicitudPedidosService],
})
export class SolicitudPedidosModule {}
