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
    getById(@Param('id') id: string) { return this.service.findOne(String(id)); }

    @Post(':id')
    create(@Param('id') id: string, @Body() dto: createProfileDto) {
        return this.service.create(String(id), dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: updateProfileDto) {
        return this.service.update(String(id), dto);
    }
}
