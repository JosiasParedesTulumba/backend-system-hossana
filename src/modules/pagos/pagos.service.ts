import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagos } from './entities/pagos.entity';
import { Repository } from 'typeorm';
import { CreatePagosDto } from './dto/create-pagos.dto';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Aula } from '../aulas/entities/aula.entity';
import { Matricula } from '../matriculas/entities/matricula.entity';
import { Padre } from '../padres/entities/padre.entity';
import { UpdatePagosDto } from './dto/update-pagos.dto';
import { Estado_pago } from './constants/estado.enum';
import { DetallePagos } from './entities/detalle-pagos.entity';
import { CreateDetallesPagosDto } from './dto/create-detalles-pagos';
import { CanalPago } from './constants/canal-pago.enum';

@Injectable()
export class PagosService {

    constructor(
        @InjectRepository(Pagos)
        private readonly pagosRepository: Repository<Pagos>,
        @InjectRepository(Matricula)
        private readonly matriculaRepository: Repository<Matricula>,
        @InjectRepository(Padre)
        private readonly padreRepository: Repository<Padre>,
        @InjectRepository(DetallePagos)
        private readonly detalleRepository: Repository<DetallePagos>
    ) { }

    //Obtener todos los pagos
    async findAll(): Promise<Pagos[]> {
        return await this.pagosRepository.find({
            relations: {
                matricula: {
                    estudiante: true,
                    aula: true,
                },
                // pagador: true,
            },
            order: {
                pagos_id: 'DESC'
            }
        })
    }   

    //Crear un nuevo pago
    async createPagos(createPagosDto: CreatePagosDto): Promise<Pagos> {

        const { matricula_id, ...datosPago } = createPagosDto;

        const matricula = await this.matriculaRepository.findOne({
            where: { matricula_id }
        });

        if (!matricula) {
            throw new NotFoundException('Matrícula no encontrada');
        }

        const nuevoPago = this.pagosRepository.create({
            ...datosPago,
            matricula,
            monto_pagado: 0,
            estado: Estado_pago.DEUDA
        });

        return await this.pagosRepository.save(nuevoPago);
    }

    //Crear un nuevo detalle de pago
    async createDetalle(createDetalleDto: CreateDetallesPagosDto): Promise<DetallePagos> {

        const { pagos_id, padre_id, monto, canal_pago } = createDetalleDto;

        // 1️⃣ Buscar el pago
        const pago = await this.pagosRepository.findOne({
            where: { pagos_id },
            relations: ['matricula']
        });

        if (!pago) {
            throw new NotFoundException('Pago no encontrado');
        }

        // 🔥 VALIDACIÓN IMPORTANTE
        const deudaPendiente = Number(pago.monto_total) - Number(pago.monto_pagado);

        if (monto <= 0) {
            throw new BadRequestException('El monto debe ser mayor a 0');
        }

        if (Number(monto) > deudaPendiente) {
            throw new BadRequestException('El monto excede la deuda pendiente');
        }

        // 2️⃣ Buscar el padre
        const padre = await this.padreRepository.findOne({
            where: { padre_id }
        });

        if (!padre) {
            throw new NotFoundException('Padre no encontrado');
        }

        // 3️⃣ Crear detalle
        const detalle = this.detalleRepository.create({
            pago,
            pagador: padre,
            canal_pago,
            monto
        });

        const detalleGuardado = await this.detalleRepository.save(detalle);

        // 4️⃣ Actualizar monto_pagado
        pago.monto_pagado = Number(pago.monto_pagado) + Number(monto);

        // 5️⃣ Actualizar estado
        pago.estado = pago.monto_pagado >= pago.monto_total
            ? Estado_pago.PAGADO
            : Estado_pago.DEUDA;

        await this.pagosRepository.save(pago);

        return detalleGuardado;
    }
    
    //Obtener un detalle por pago

    async findOneDetalle(id: number): Promise<DetallePagos> {
        const detalle = await this.detalleRepository.findOne
            ({
                where: {detalle_id: id},
                relations: {
                    pagador: true,
                    pago: true
                }
            })
        if (!detalle) {throw new NotFoundException ('Detalle no encontrado')}
        return detalle
    }

    //Obtener un pago por id
    async findOne(id: number): Promise<Pagos> {
        const pago = await this.pagosRepository.findOne
            ({
                where: { pagos_id: id },
                relations: {
                    matricula: {
                        estudiante: true,
                        aula: true,
                    },
                    // pagador: true,
                }
            })
        if (!pago) { throw new NotFoundException('Pago no encontrado') }
        return pago
    }

    //eliminar pago
    async remove(id: number): Promise<Pagos> {
        const pago = await this.pagosRepository.findOne({
            where: { pagos_id: id },
        });

        if (!pago) {
            throw new NotFoundException('Pago no encontrado');
        }
        await this.pagosRepository.remove(pago);
        return pago;
    }

    //eliminar pago
    // async remove(id: number): Promise<{ message: string; pago: Pagos }> {
    //     const pago = await this.pagosRepository.findOne({
    //         where: { pagos_id: id },
    //     });

    //     if (!pago) {
    //         throw new NotFoundException('Pago no encontrado');
    //     }
    //     await this.pagosRepository.remove(pago);
    //     return {
    //         message: 'Pago eliminado correctamente',
    //         pago: pago
    //     };
    // }

}
