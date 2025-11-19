import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PagosModule } from './pagos/pagos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { SolicitudPedidosModule } from './solicitud-pedidos/solicitud-pedidos.module';
import { PrediccionesModule } from './predicciones/predicciones.module';
import { LogsModule } from './logs/logs.module';
import { MailService } from './mail/mail.service';
import { AuthModule } from './auth/auth.module';

// 👇 AGREGA ESTAS DOS IMPORTACIONES 👇
import { AppController } from './app.controller'; // ⬅️ Faltaba esto
import { AppService } from './app.service';       // ⬅️ Faltaba esto

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  // 👇 REGISTRA EL CONTROLADOR AQUÍ 👇
  controllers: [AppController], // ⬅️ ¡ESTO ES LO QUE HACE QUE FUNCIONE LA RUTA!
  
  // 👇 REGISTRA EL SERVICIO AQUÍ 👇
  providers: [AppService, MailService], // ⬅️ Agrega AppService junto a MailService
})
export class AppModule {}