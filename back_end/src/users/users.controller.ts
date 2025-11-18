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
    getById(@Param('id') id: String) { return this.service.getUser(String(id)); }

    @Post()
    create(@Body() dto: createUserDto) {
        return this.service.createPost(dto);
    }

    @Patch(':id')
    update(@Param('id') id: String, @Body() dto: uptadeUserDto) {
        return this.service.update(String(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.delete(String(id));
    }
}
