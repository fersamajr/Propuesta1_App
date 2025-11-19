import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Usuario } from './entity/User.entity';
import { InventarioModule } from './inventario/inventario.module';
import { InventarioPersonalModule } from './inventario-personal/inventario-personal.module';
import { ProfileModule } from './profile/profile.module';
import { MailService } from '../mail/mail.service'; // ⬅️ 1. IMPORTAR ESTO

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    InventarioModule,
    InventarioPersonalModule,
    ProfileModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    MailService // ⬅️ 2. AGREGAR ESTO AQUÍ
  ],
  exports: [UsersService, UsersModule],
})
export class UsersModule {}