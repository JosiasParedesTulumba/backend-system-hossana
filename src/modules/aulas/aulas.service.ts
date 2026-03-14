import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Aula } from './entities/aula.entity';
import { Repository } from 'typeorm';
import { NivelEducativo } from './constants/nivel-educativo.enum';
import { MaterialAula } from '../materiales/entities/material-aula.entity';
import { Material } from '../materiales/entities/material.entity';
import { Matricula } from '../matriculas/entities/matricula.entity';
import { MaterialEstudiante } from '../materiales/entities/material-estudiante.entity';
import { EstadoMatricula } from '../matriculas/constants/estado-matricula.enum';
import { MaterialTipo } from '../materiales/constants/material-tipo.enum';

@Injectable()
export class AulasService {

  constructor(
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
    @InjectRepository(MaterialAula)
    private readonly materialAulaRepository: Repository<MaterialAula>,
    @InjectRepository(Matricula)
    private readonly matriculaRepository: Repository<Matricula>,
    @InjectRepository(MaterialEstudiante)
    private readonly materialEstudianteRepository: Repository<MaterialEstudiante>,
  ) { }

  async create(createAulaDto: CreateAulaDto): Promise<Aula> {
    try {
      const newAula = this.aulaRepository.create(createAulaDto);
      return await this.aulaRepository.save(newAula);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear el aula');
    }
  }

  async findAll(): Promise<Aula[]> {
    return await this.aulaRepository.find({
      order: {
        nivel: 'ASC',
        grado: 'ASC',
        seccion: 'ASC',
      }
    });
  }

  async findOne(aula_id: number): Promise<Aula> {
    const aula = await this.aulaRepository.findOneBy({ aula_id });

    if (!aula) {
      throw new NotFoundException('Aula no encontrada ');
    }

    return aula;
  }

  async update(aula_id: number, updateAulaDto: UpdateAulaDto): Promise<Aula> {
    const aula = await this.aulaRepository.findOne({
      where: { aula_id },
    });

    if (!aula) {
      throw new NotFoundException('No se encontro el aula');
    }

    const updateAula = this.aulaRepository.merge(
      aula,
      updateAulaDto
    );

    return await this.aulaRepository.save(updateAula);
  }

  async findByNivelGradoSeccion(
    nivel: NivelEducativo,
    grado: string,
    seccion: string
  ): Promise<Aula> {

    const aula = await this.aulaRepository.findOne({
      where: {
        nivel,
        grado,
        seccion
      }
    });

    if (!aula) {
      throw new NotFoundException(
        'No existe un aula con el nivel, grado y sección seleccionados'
      );
    }

    return aula;
  }

  async getNombreAula( id: number): Promise<string> {
    const aula = await this.findOne(id);
    return `${aula.nivel}-${aula.grado}-${aula.seccion}`;
  }

  remove(id: number) {
    return `This action removes a #${id} aula`;
  }

  // ============ RESUMEN DE MATERIALES POR AULA ============

  async getResumenMateriales(): Promise<any[]> {
    const aulas = await this.aulaRepository.find({
      order: { nivel: 'ASC', grado: 'ASC', seccion: 'ASC' },
    });

    const resultado: any[] = [];

    for (const aula of aulas) {
      const materialAulas = await this.materialAulaRepository.find({
        where: { aula: { aula_id: aula.aula_id } },
        relations: ['material'],
      });

      const materialesAseo = materialAulas
        .filter(ma => ma.material.tipo === MaterialTipo.ASEO)
        .map(ma => ({
          material_aula_id: ma.material_aula_id,
          material_id: ma.material.material_id,
          nombre: ma.material.nombre,
          cantidad_asignada: ma.cantidad_asignada,
          categoria: ma.material.categoria,
        }));

      const materialesTrabajo = materialAulas
        .filter(ma => ma.material.tipo === MaterialTipo.TRABAJO)
        .map(ma => ({
          material_aula_id: ma.material_aula_id,
          material_id: ma.material.material_id,
          nombre: ma.material.nombre,
          cantidad_asignada: ma.cantidad_asignada,
          categoria: ma.material.categoria,
        }));

      resultado.push({
        aula_id: aula.aula_id,
        nivel: aula.nivel,
        grado: aula.grado,
        seccion: aula.seccion,
        materiales_aseo: materialesAseo,
        materiales_trabajo: materialesTrabajo,
        total_aseo: materialesAseo.length,
        total_trabajo: materialesTrabajo.length,
      });
    }

    return resultado;
  }

  // ============ ESTUDIANTES MATRICULADOS EN UN AULA ============

  async getEstudiantesPorAula(aulaId: number, materialId?: number): Promise<any[]> {
    const aula = await this.aulaRepository.findOne({
      where: { aula_id: aulaId },
    });
    if (!aula) {
      throw new NotFoundException(`Aula con ID ${aulaId} no encontrada`);
    }

    const matriculas = await this.matriculaRepository.find({
      where: {
        aula: { aula_id: aulaId },
        estado: EstadoMatricula.ACTIVO,
      },
      relations: ['estudiante'],
    });

    let estudiantes = matriculas.map(m => ({
      estudiante_id: m.estudiante.estudiante_id,
      dni: m.estudiante.dni,
      nombres: m.estudiante.nombres,
      apellido_paterno: m.estudiante.apellido_paterno,
      apellido_materno: m.estudiante.apellido_materno,
    }));

    if (materialId) {
      const asignados = await this.materialEstudianteRepository.find({
        where: { material: { material_id: materialId } },
        relations: ['estudiante'],
      });

      const idsAsignados = new Set(asignados.map(a => a.estudiante.estudiante_id));
      estudiantes = estudiantes.filter(e => !idsAsignados.has(e.estudiante_id));
    }

    return estudiantes;
  }
}
