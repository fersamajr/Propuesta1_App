// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Usuario } from './entity/User.entity';
import { InventarioModule } from './inventario/inventario.module';
import { InventarioPersonalModule } from './inventario-personal/inventario-personal.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    InventarioModule,
    InventarioPersonalModule,
    ProfileModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // <--- Obligatorio exportar
})
export class UsersModule {}
