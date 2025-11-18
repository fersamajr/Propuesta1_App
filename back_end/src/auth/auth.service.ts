// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    // Helper para convertir '1h', '60m' a segundos numéricos
    private parseExpiration(expiration: string): number {
    if (expiration.endsWith('h')) {
        return parseInt(expiration.slice(0, -1)) * 3600;
    }
    if (expiration.endsWith('m')) {
        return parseInt(expiration.slice(0, -1)) * 60;
    }
    const asNumber = Number(expiration);
    if (isNaN(asNumber)) throw new Error('Invalid expiration format');
    return asNumber;
    }


    async register(username: string, email: string, password: string) {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
        throw new ConflictException('Email ya registrado');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.usersService.create({
        username,
        email,
        password: hashedPassword,
        rol: 'cliente',
        });
        return this.generateTokens(newUser);
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
        throw new UnauthorizedException('Credenciales inválidas');
        }
        if (!user.isActive) {
        throw new UnauthorizedException('Usuario inactivo');
        }
        return this.generateTokens(user);
    }

    async refreshAccessToken(refreshToken: string) {
        try {
        const decoded = this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'default_refresh_secret',
        });

        const storedToken = await this.refreshTokenRepository.findOne({
            where: { token: refreshToken, isRevoked: false },
        });

        if (!storedToken || new Date() > storedToken.expiresAt) {
            throw new UnauthorizedException('Refresh token inválido');
        }

        const user = await this.usersService.findById(decoded.sub);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Usuario no disponible');
        }

        return {
            accessToken: this.jwtService.sign(
            { email: user.email, rol: user.rol },
            {
                subject: user.id,
                secret: this.configService.get<string>('JWT_SECRET') || 'default_secret',
                expiresIn: this.parseExpiration(this.configService.get<string>('JWT_EXPIRATION') || '3600'),
            },
            ),
        };
        } catch (e) {
        throw new UnauthorizedException('Token inválido');
        }
    }

    async logout(refreshToken: string) {
        await this.refreshTokenRepository.update(
        { token: refreshToken },
        { isRevoked: true },
        );
        return { message: 'Sesión cerrada' };
    }

    private async generateTokens(user: any) {
        const payload = { email: user.email, rol: user.rol };

        const accessToken = this.jwtService.sign(payload, {
        subject: user.id,
        expiresIn: this.parseExpiration(this.configService.get<string>('JWT_EXPIRATION') || '3600'),
        secret: this.configService.get<string>('JWT_SECRET') || 'default_secret',
        });

        const refreshToken = this.jwtService.sign(payload, {
        subject: user.id,
        expiresIn: '7d',
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'default_refresh_secret',
        });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.refreshTokenRepository.save({
        usuarioId: user.id,  // notar cambio a usuarioId según entidad
        token: refreshToken,
        expiresAt,
        });

        return { accessToken, refreshToken, user };
    }
}
