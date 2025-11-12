import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Usuario } from './entity/User.entity'; // Ajusta el path/nombre si tu entidad cambia

// Si también tienes submódulos propios con entidades, agrégalos igual que abajo
import { InventarioModule } from './inventario/inventario.module';
import { InventarioPersonalModule } from './inventario-personal/inventario-personal.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    InventarioModule,
    InventarioPersonalModule,
    ProfileModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
