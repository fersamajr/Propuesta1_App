import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './pago.entity';
import { createPagoDto } from './dto/CreatePago.dto';
import { updatePagoDto } from './dto/UpdatePago.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PagosService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Pago) private pagosRepository: Repository<Pago>,
    ) {}

    async createPago(dto: createPagoDto) {
        const user = await this.usersService.getUser(dto.usuarioId);
        if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        const pago = this.pagosRepository.create({
        ...dto,
        usuario: user,
        });
        return this.pagosRepository.save(pago);
    }

    findAll() {
        return this.pagosRepository.find({ relations: ['usuario'] });
    }

    async findOne(id: number) {
        const pago = await this.pagosRepository.findOne({
        where: { id },
        relations: ['usuario'],
        });
        if (!pago) {
        throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
        }
        return pago;
    }

    async update(id: number, dto: updatePagoDto) {
        const pago = await this.pagosRepository.findOneBy({ id });
        if (!pago) {
        throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
        }
        Object.assign(pago, dto);
        return this.pagosRepository.save(pago);
    }

    async remove(id: number) {
        const pago = await this.pagosRepository.findOneBy({ id });
        if (!pago) {
        throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
        }
        await this.pagosRepository.delete(id);
        return { deleted: true, id };
    }
}
