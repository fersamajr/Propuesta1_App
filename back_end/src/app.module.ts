// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PagosModule } from './pagos/pagos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { SolicitudPedidosModule } from './solicitud-pedidos/solicitud-pedidos.module';
import { PrediccionesModule } from './predicciones/predicciones.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    UsersModule,
    PagosModule,
    PedidosModule,
    SolicitudPedidosModule,
    PrediccionesModule,
    LogsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Fp$c0105',
      database: 'app_propuesta1',
      entities: [__dirname + '/**/*entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
