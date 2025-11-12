import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [UsersModule], 
  controllers: [PagosController],
  providers: [PagosService]
})
export class PagosModule {}
