import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagos } from './entities/pagos.entity';
import { Repository } from 'typeorm';
import { CreatePagosDto } from './dto/create-pagos.dto';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Aula } from '../aulas/entities/aula.entity';
import { Matricula } from '../matriculas/entities/matricula.entity';
import { Padre } from '../padres/entities/padre.entity';
import { UpdatePagosDto } from './dto/update-pagos.dto';

@Injectable()
export class PagosService {

    constructor(
        @InjectRepository(Pagos)
        private readonly pagosRepository: Repository<Pagos>,
        @InjectRepository(Estudiante)
        private readonly estudianteRepository: Repository<Estudiante>,
        @InjectRepository(Aula)
        private readonly aulaRepository: Repository<Aula>,
        @InjectRepository(Matricula)
        private readonly matriculaRepository: Repository<Matricula>,
        @InjectRepository(Padre)
        private readonly padreRepository: Repository<Padre>,
    ) { }

    //Obtener todos los pagos
    async findAll(): Promise<Pagos[]> {
        return await this.pagosRepository.find({
            relations: {
                estudiante: true,
                aula: true,
                matricula: true,
                pagador: true,
            },
            order: {
                pagos_id: 'DESC'
            }
        })
    }

    //Agregar un pago

    async create(createPagosDto: CreatePagosDto): Promise<Pagos> {

        const { estudiante_id, aula_id, matricula_id, madre_id, padre_id, tutor_id, padre_responsable_id, ...datosPago } = createPagosDto;


        const estudiante = await this.estudianteRepository.findOneBy({ estudiante_id });
        if (!estudiante) {
            throw new NotFoundException('Estudiante no encontrado');
        }
        const aula = await this.aulaRepository.findOneBy({ aula_id });
        if (!aula) {
            throw new NotFoundException('Aula no encontrada');
        }
        const matricula = await this.matriculaRepository.findOneBy({ matricula_id });
        if (!matricula) {
            throw new NotFoundException('Matrícula no encontrada');
        }

        const padre = await this.padreRepository.findOneBy({ padre_id: padre_id });
        if (!padre) {
            throw new NotFoundException('Padre no encontrado');
        }

        const nuevoPago = this.pagosRepository.create({
            ...datosPago,
            estudiante,
            aula,
            matricula,
            pagador: padre,
        });

        return await this.pagosRepository.save(nuevoPago);
    }

    //Actualizar un pago
    async update(
        id: number,
        updatePagosDto: UpdatePagosDto
    ): Promise<Pagos> {

        const pago = await this.pagosRepository.findOne({
            where: { pagos_id: id },
            relations: ['estudiante', 'aula', 'matricula', 'pagador'],
        });

        if (!pago) {
            throw new NotFoundException('Pago no encontrado');
        }

        const {
            estudiante_id,
            aula_id,
            matricula_id,
            padre_id,
            ...datosPago
        } = updatePagosDto;

        Object.assign(pago, datosPago);

        if (estudiante_id) {
            const estudiante = await this.estudianteRepository.findOneBy({ estudiante_id });
            if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
            pago.estudiante = estudiante;
        }

        if (aula_id) {
            const aula = await this.aulaRepository.findOneBy({ aula_id });
            if (!aula) throw new NotFoundException('Aula no encontrada');
            pago.aula = aula;
        }

        if (padre_id) {
            const padre = await this.padreRepository.findOneBy({ padre_id });
            if (!padre) throw new NotFoundException('Padre no encontrado');
            pago.pagador = padre;
        }

        return await this.pagosRepository.save(pago);
    }

    //Obtener un pago por id
    async findOne(id: number): Promise<Pagos> {
        const pago = await this.pagosRepository.findOne
            ({
                where: { pagos_id: id },
                relations: {
                    estudiante: true,
                    aula: true,
                    matricula: true,
                    pagador: true,
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
