import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrediccionesService } from './predicciones.service';
import { PrediccionesController } from './predicciones.controller';
import { Prediccion } from './prediccion.entity';
import { UsersModule } from 'src/users/users.module';
import { Pedido } from 'src/pedidos/pedido.entity';
import { PedidosModule } from 'src/pedidos/pedidos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prediccion]),TypeOrmModule.forFeature([Pedido]),
      UsersModule,forwardRef(() =>PedidosModule)],
  controllers: [PrediccionesController],
  providers: [PrediccionesService],
  exports: [PrediccionesService],
})
export class PrediccionesModule {}
