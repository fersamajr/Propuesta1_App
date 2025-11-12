import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrediccionesService } from './predicciones.service';
import { PrediccionesController } from './predicciones.controller';
import { Prediccion } from './prediccion.entity'; // Ajusta el nombre y path de la entidad si cambia

@Module({
  imports: [TypeOrmModule.forFeature([Prediccion])],
  controllers: [PrediccionesController],
  providers: [PrediccionesService],
  exports: [PrediccionesService],
})
export class PrediccionesModule {}
