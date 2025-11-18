// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, UseGuards, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() body: { username: string; email: string; password: string }) {
        return this.authService.register(body.username, body.email, body.password);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshAccessToken(body.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Body() body: { refreshToken: string }) {
        return this.authService.logout(body.refreshToken);
    }
}
