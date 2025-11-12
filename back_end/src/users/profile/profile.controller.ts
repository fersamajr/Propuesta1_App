import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { createProfileDto } from '../dto/createProfile.dto';
import { updateProfileDto } from '../dto/updateProfile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly service: ProfileService) {}

    @Get()
    getAll() { return this.service.findAll(); }

    @Get(':id')
    getById(@Param('id') id: number) { return this.service.findOne(Number(id)); }

    @Post(':id')
    create(@Param('id') id: number, @Body() dto: createProfileDto) {
        return this.service.create(Number(id), dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: updateProfileDto) {
        return this.service.update(Number(id), dto);
    }
}
