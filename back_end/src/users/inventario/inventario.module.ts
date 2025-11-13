import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from '../entity/inventario.entity';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { Usuario } from '../entity/User.entity';
import { UsersModule } from '../users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Inventario,Usuario]),
    forwardRef(() =>UsersModule )],
    providers: [InventarioService],
    controllers: [InventarioController],
    exports: [InventarioService],
})
export class InventarioModule {}
