import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioPersonal } from '../entity/inventarioPersonal.entity';
import { InventarioPersonalService } from './inventario-personal.service';
import { InventarioPersonalController } from './inventario-personal.controller';

@Module({
    imports: [TypeOrmModule.forFeature([InventarioPersonal])],
    providers: [InventarioPersonalService],
    controllers: [InventarioPersonalController],
    exports: [InventarioPersonalService],
})
export class InventarioPersonalModule {}
