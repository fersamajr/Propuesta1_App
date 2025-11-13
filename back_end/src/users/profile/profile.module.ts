import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../entity/profile.entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Usuario } from '../entity/User.entity';
import { UsersModule } from '../users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Profile,Usuario]),
    forwardRef(() =>UsersModule )],
    providers: [ProfileService],
    controllers: [ProfileController],
    exports: [ProfileService],
})
export class ProfileModule {}
