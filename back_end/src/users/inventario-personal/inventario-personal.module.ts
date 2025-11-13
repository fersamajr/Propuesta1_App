import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioPersonal } from '../entity/inventarioPersonal.entity';
import { InventarioPersonalService } from './inventario-personal.service';
import { InventarioPersonalController } from './inventario-personal.controller';
import { Usuario } from '../entity/User.entity';
import { UsersModule } from '../users.module';

@Module({
    imports: [TypeOrmModule.forFeature([InventarioPersonal,Usuario]),
    forwardRef(() =>UsersModule )],
    providers: [InventarioPersonalService],
    controllers: [InventarioPersonalController],
    exports: [InventarioPersonalService],
})
export class InventarioPersonalModule {}
