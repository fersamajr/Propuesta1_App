import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InventarioService } from './inventario/inventario.service';
import { InventarioPersonalService } from './inventario-personal/inventario-personal.service';
import { ProfileService } from './profile/profile.service';
import { InventarioController } from './inventario/inventario.controller';
import { InventarioPersonalController } from './inventario-personal/inventario-personal.controller';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { InventarioModule } from './inventario/inventario.module';
import { InventarioPersonalModule } from './inventario-personal/inventario-personal.module';

@Module({
  controllers: [UsersController, InventarioController, InventarioPersonalController, ProfileController],
  providers: [UsersService, InventarioService, InventarioPersonalService, ProfileService],
  imports: [ProfileModule, InventarioModule, InventarioPersonalModule],
  exports: [UsersService]
})
export class UsersModule {}
