import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Matricula } from './entities/matricula.entity';
import { Like, Repository } from 'typeorm';
import { EstadoMatricula } from './constants/estado-matricula.enum';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Aula } from '../aulas/entities/aula.entity';
import { Padre } from '../padres/entities/padre.entity';

@Injectable()
export class MatriculasService {

  constructor(
    @InjectRepository(Matricula)
    private readonly matriculaRepository: Repository<Matricula>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
    @InjectRepository(Padre)
    private readonly padreRepository: Repository<Padre>,

  ) { }

  // Obtener todas las matrículas
  async findAll(): Promise<Matricula[]> {
    return await this.matriculaRepository.find({
      relations: {
        estudiante: true,
        aula: true,
        padre_responsable: true
      },
      order: {
        matricula_id: 'DESC',
      },
    });
  }


  //Obtener matriculas activas
  async findActivos(): Promise<Matricula[]> {
    return await this.matriculaRepository.find
      ({
        where: { estado: EstadoMatricula.ACTIVO },
        relations: {
          estudiante: true,
          aula: true,
          padre_responsable: true
        },
      })
  }

  // Crear una nueva matrícula
  async create(createMatriculaDto: CreateMatriculaDto): Promise<Matricula> {

    const { estudiante_id, aula_id, padre_responsable_id, ...datosMatricula } = createMatriculaDto;
    const estudiante = await this.estudianteRepository.findOneBy({ estudiante_id });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    const aula = await this.aulaRepository.findOneBy({ aula_id });
    if (!aula) {
      throw new NotFoundException('Aula no encontrada');
    }

    const padre = await this.padreRepository.findOneBy({ padre_id: padre_responsable_id });
    if (!padre) {
      throw new NotFoundException('Padre responsable no encontrado');
    }

    const codigo_matricula = await this.generarCodigoMatricula();

    const nuevaMatricula = this.matriculaRepository.create({
      ...datosMatricula,
      codigo_matricula,
      estudiante,
      aula,
      padre_responsable: padre,
    });

    return await this.matriculaRepository.save(nuevaMatricula);
  }

  private async generarCodigoMatricula(): Promise<string> {
    const year = new Date().getFullYear();
    console.log('Año actual backend:', year);

    const total = await this.matriculaRepository.count({
      where: {
        codigo_matricula: Like(`MAT-${year}-%`)
      }
    });

    const correlativo = (total + 1).toString().padStart(4, '0');

    return `MAT-${year}-${correlativo}`;
  }

  //Actualizar una matricula
  async update(
    id: number,
    updateMatriculaDto: UpdateMatriculaDto
  ): Promise<Matricula> {

    const matricula = await this.matriculaRepository.findOne({
      where: { matricula_id: id },
      relations: ['estudiante', 'aula', 'padre_responsable'],
    });

    if (!matricula) {
      throw new NotFoundException('Matrícula no encontrada');
    }

    const {
      estudiante_id,
      aula_id,
      padre_responsable_id,
      ...datosMatricula
    } = updateMatriculaDto;

    Object.assign(matricula, datosMatricula);
    
    if (estudiante_id) {
      const estudiante = await this.estudianteRepository.findOneBy({ estudiante_id });
      if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
      matricula.estudiante = estudiante;
    }

    if (aula_id) {
      const aula = await this.aulaRepository.findOneBy({ aula_id });
      if (!aula) throw new NotFoundException('Aula no encontrada');
      matricula.aula = aula;
    }

    if (padre_responsable_id) {
      const padre = await this.padreRepository.findOneBy({ padre_id: padre_responsable_id });
      if (!padre) throw new NotFoundException('Padre responsable no encontrado');
      matricula.padre_responsable = padre;
    }

    return await this.matriculaRepository.save(matricula);
  }


  //Obtener una matricula por id
  async findOne(id: number): Promise<Matricula> {
    const matricula = await this.matriculaRepository.findOne
      ({
        where: { matricula_id: id },
        relations: {
          estudiante: true,
          aula: true,
          padre_responsable: true
        },
      })
    if (!matricula) { throw new NotFoundException('Matricula no encontrada') }
    return matricula;
  }

  //Cambiar estado
  async cambiarEstado(id: number, estado: EstadoMatricula): Promise<Matricula> {
    const matricula = await this.matriculaRepository.findOne({ where: { matricula_id: id } });
    if (!matricula) throw new NotFoundException('Matricula no encontrada');
    matricula.estado = estado;
    return await this.matriculaRepository.save(matricula)
  }
}