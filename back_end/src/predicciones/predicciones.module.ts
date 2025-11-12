import { Module } from '@nestjs/common';
import { PrediccionesService } from './predicciones.service';
import { PrediccionesController } from './predicciones.controller';

@Module({
  providers: [PrediccionesService],
  controllers: [PrediccionesController]
})
export class PrediccionesModule {}
