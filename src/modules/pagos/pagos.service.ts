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
import { UpdateDetallesDto } from './dto/update-detalles.dto';
import { Concepto } from './constants/concepto.enum';

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

        // ===============================
        // 🔴 VALIDAR INSCRIPCIÓN (UNA VEZ)
        // ===============================
        if (datosPago.concepto === Concepto.INSCRIPCION) {

            const existe = await this.pagosRepository.findOne({
                where: {
                    concepto: Concepto.INSCRIPCION,
                    matricula: { matricula_id }
                },
                relations: ['matricula']
            });

            if (existe) {
                throw new BadRequestException('La inscripción ya existe para este estudiante');
            }
        }

        // ===============================
        // 🔵 VALIDAR MATRÍCULA (POR AÑO)
        // ===============================
        if (datosPago.concepto === Concepto.MATRICULA) {

            const pagos = await this.pagosRepository.find({
                where: {
                    concepto: Concepto.MATRICULA,
                    matricula: { matricula_id }
                },
                relations: ['detalles']
            });

            const añoActual = new Date().getFullYear();

            const yaExiste = pagos.some(p =>
                p.detalle_pagos?.some(d =>
                    new Date(d.fecha_pago).getFullYear() === añoActual
                )
            );

            if (yaExiste) {
                throw new BadRequestException('La matrícula ya fue pagada este año');
            }
        }

        // ===============================
        // 🟢 CREAR PAGO
        // ===============================
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

    //Obtener detalles de pago por id de pago
    async findDetallesByPago(id: number): Promise<DetallePagos[]> {

        const detalles = await this.detalleRepository.find({
            where: {
                pago: { pagos_id: id }
            },
            relations: {
                pagador: true,
                pago: {
                    matricula: {
                        estudiante: true,
                        aula: true
                    }
                }
            },
            order: {
                fecha_pago: 'DESC'
            }
        });

        if (!detalles.length) {
            throw new NotFoundException('No hay detalles de pago');
        }

        return detalles;
    }

    //Actualizar un pago (solo monto_pagado, el estado se actualiza automáticamente)
    async update(id: number, updatePagosDto: UpdatePagosDto): Promise<Pagos> {

        const pago = await this.pagosRepository.findOne({
            where: { pagos_id: id }
        });

        if (!pago) {
            throw new NotFoundException('Pago no encontrado');
        }

        // actualizar monto
        if (updatePagosDto.monto_pagado !== undefined) {
            pago.monto_pagado = Number(updatePagosDto.monto_pagado);
        }

        // 🔥 calcular estado AUTOMÁTICO
        pago.estado = pago.monto_pagado >= pago.monto_total
            ? Estado_pago.PAGADO
            : Estado_pago.DEUDA;

        return await this.pagosRepository.save(pago);
    }


    async updateDetalle(
        detalle_id: number,
        updateDetalleDto: UpdateDetallesDto
    ): Promise<DetallePagos> {

        const detalle = await this.detalleRepository.findOne({
            where: { detalle_id },
            relations: ['pago', 'pagador']
        });

        if (!detalle) {
            throw new NotFoundException('Detalle no encontrado');
        }

        // 🚫 No permitir editar si ya está pagado
        if (detalle.pago.estado === Estado_pago.PAGADO) {
            throw new BadRequestException('No se puede editar un pago completado');
        }

        const pago = detalle.pago;

        let huboCambios = false; // 👈 para controlar si actualizar fecha

        // =========================
        // 🔥 VALIDAR MONTO
        // =========================
        let nuevoMonto = detalle.monto;

        if (updateDetalleDto.monto !== undefined) {

            nuevoMonto = Number(updateDetalleDto.monto);

            if (isNaN(nuevoMonto)) {
                throw new BadRequestException('El monto debe ser un número válido');
            }

            if (nuevoMonto <= 0) {
                throw new BadRequestException('El monto debe ser mayor a 0');
            }

            // 🔄 Restar el monto anterior
            pago.monto_pagado = Number(pago.monto_pagado) - Number(detalle.monto);

            const deudaPendiente = Number(pago.monto_total) - Number(pago.monto_pagado);

            if (nuevoMonto > deudaPendiente) {
                throw new BadRequestException('El monto excede la deuda pendiente');
            }

            detalle.monto = nuevoMonto;

            // 🔄 Volver a sumar
            pago.monto_pagado = Number(pago.monto_pagado) + nuevoMonto;

            huboCambios = true;
        }

        // =========================
        // 🔥 ACTUALIZAR CANAL
        // =========================
        if (updateDetalleDto.canal_pago !== undefined) {
            detalle.canal_pago = updateDetalleDto.canal_pago;
            huboCambios = true;
        }

        // =========================
        // 🔥 ACTUALIZAR PADRE
        // =========================
        if (updateDetalleDto.padre_id !== undefined) {

            const padre = await this.padreRepository.findOne({
                where: { padre_id: updateDetalleDto.padre_id }
            });

            if (!padre) {
                throw new NotFoundException('Padre no encontrado');
            }

            detalle.pagador = padre;
            huboCambios = true;
        }

        // =========================
        // 🕒 ACTUALIZAR FECHA (🔥 CLAVE)
        // =========================
        if (huboCambios) {
            detalle.fecha_pago = new Date().toISOString(); // 👈 AQUÍ
        }

        await this.detalleRepository.save(detalle);

        // =========================
        // 🔄 ACTUALIZAR ESTADO
        // =========================
        pago.estado = pago.monto_pagado >= pago.monto_total
            ? Estado_pago.PAGADO
            : Estado_pago.DEUDA;

        await this.pagosRepository.save(pago);

        return detalle;
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

    async removeDetalle(id: number): Promise<DetallePagos> {

        const detalle = await this.detalleRepository.findOne({
            where: { detalle_id: id },
            relations: ['pago']
        });

        if (!detalle) {
            throw new NotFoundException('Detalle de pago no encontrado');
        }

        const pago = detalle.pago;

        // 🔥 ELIMINAR PRIMERO
        await this.detalleRepository.remove(detalle);

        // 🔥 RECALCULAR TOTAL
        const detalles = await this.detalleRepository.find({
            where: { pago: { pagos_id: pago.pagos_id } }
        });

        const totalPagado = detalles.reduce(
            (sum, d) => sum + Number(d.monto),
            0
        );

        pago.monto_pagado = Number(totalPagado.toFixed(2));

        // 🔥 ACTUALIZAR ESTADO
        pago.estado = totalPagado >= Number(pago.monto_total)
            ? Estado_pago.PAGADO
            : Estado_pago.DEUDA;

        await this.pagosRepository.save(pago);

        return detalle;
    }

}
