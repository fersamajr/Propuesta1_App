import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PagosModule } from './pagos/pagos.module';
import { PedidosController } from './pedidos/pedidos.controller';
import { PedidosModule } from './pedidos/pedidos.module';
import { SolicitudPedidoController } from './solicitud-pedido/solicitud-pedido.controller';
import { SolicitudPedidosModule } from './solicitud-pedidos/solicitud-pedidos.module';
import { PrediccionesModule } from './predicciones/predicciones.module';
import { LogsController } from './logs/logs.controller';
import { LogsService } from './logs/logs.service';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [UsersModule, PagosModule, PedidosModule, SolicitudPedidosModule, PrediccionesModule, LogsModule],
  controllers: [AppController, PedidosController, SolicitudPedidoController, LogsController],
  providers: [AppService, LogsService],
})
export class AppModule {}
