// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';  // <-- Importar ConfigModule explícitamente
import { UsersModule } from './users/users.module';
import { PagosModule } from './pagos/pagos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { SolicitudPedidosModule } from './solicitud-pedidos/solicitud-pedidos.module';
import { PrediccionesModule } from './predicciones/predicciones.module';
import { LogsModule } from './logs/logs.module';
import { MailService } from './mail/mail.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Para que esté disponible en toda la app
    }),
    UsersModule,
    PagosModule,
    PedidosModule,
    SolicitudPedidosModule,
    PrediccionesModule,
    LogsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'Fp$c0105',
      database: process.env.DB_DATABASE || 'app_propuesta1',
      entities: [__dirname + '/**/*entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
  ],
  providers: [MailService],
})
export class AppModule {}
