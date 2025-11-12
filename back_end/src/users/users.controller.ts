import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { createUserDto } from './dto/createUser.dto';
import { uptadeUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Get()
    getAll() { return this.service.findAll(); }

    @Get(':id')
    getById(@Param('id') id: number) { return this.service.getUser(Number(id)); }

    @Post()
    create(@Body() dto: createUserDto) {
        return this.service.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: uptadeUserDto) {
        return this.service.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.service.delete(Number(id));
    }
}
