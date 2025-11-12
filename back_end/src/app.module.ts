import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PagosModule } from './pagos/pagos.module';
import { PedidosController } from './pedidos/pedidos.controller';
import { PedidosModule } from './pedidos/pedidos.module';
import { SolicitudPedidoController } from './solicitud-pedidos/solicitud-pedido.controller';
import { SolicitudPedidosModule } from './solicitud-pedidos/solicitud-pedidos.module';
import { PrediccionesModule } from './predicciones/predicciones.module';
import { LogsController } from './logs/logs.controller';
import { LogsService } from './logs/logs.service';
import { LogsModule } from './logs/logs.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [UsersModule, PagosModule, PedidosModule, SolicitudPedidosModule, PrediccionesModule, LogsModule, TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Fp$c0105',
      database: 'app_propuesta1',
      entities: [__dirname + '/**/*entity{.ts,.js}'],
      synchronize: true,
    })],
  controllers: [AppController, PedidosController, SolicitudPedidoController, LogsController],
  providers: [AppService, LogsService],
})
export class AppModule {}
