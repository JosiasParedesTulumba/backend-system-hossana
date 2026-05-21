import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { MaterialAula } from './entities/material-aula.entity';
import { MaterialEstudiante } from './entities/material-estudiante.entity';
import { Aula } from '../aulas/entities/aula.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { EstadoMaterialEstudiante } from './constants/estado-material-estudent.enum';
import { MaterialTipo } from './constants/material-tipo.enum';

@Injectable()
export class MaterialesService {
  private readonly logger = new Logger(MaterialesService.name);

  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(MaterialAula)
    private readonly materialAulaRepository: Repository<MaterialAula>,
    @InjectRepository(MaterialEstudiante)
    private readonly materialEstudianteRepository: Repository<MaterialEstudiante>,
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    private readonly dataSource: DataSource,
  ) { }

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const materialExistente = await this.materialRepository.findOne({
      where: { nombre: createMaterialDto.nombre }
    });

    if (materialExistente) {
      throw new ConflictException(`Material con nombre ${createMaterialDto.nombre} ya existe`);
    }

    const newMaterial = this.materialRepository.create(createMaterialDto);
    return await this.materialRepository.save(newMaterial);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const skip = (page - 1) * limit;

    const [data, total] = await this.materialRepository.findAndCount({
      take: limit,
      skip,
      order: {
        material_id: 'DESC',
      },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      }
    };
  }

  async findOne(id: number): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: { material_id: id }
    });
    if (!material) throw new NotFoundException(`Material con ID ${id} no encontrado`);
    return material;
  }

  async update(id: number, updateMaterialDto: UpdateMaterialeDto): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: { material_id: id }
    });

    if (!material) {
      throw new NotFoundException('Material no encontrado');
    }

    const updatedMaterial = this.materialRepository.merge(material, updateMaterialDto);
    return await this.materialRepository.save(updatedMaterial);
  }

  async remove(id: number) {
    const material = await this.materialRepository.findOne({
      where: { material_id: id }
    });

    if (!material) {
      throw new NotFoundException('Material no encontrado');
    }

    await this.materialRepository.softDelete(id);
    return {
      message: "Material eliminado correctamente (SoftDelete)"
    };
  }

  async getAulasAsignadas(materialId: number): Promise<any[]> {
    const material = await this.materialRepository.findOne({
      where: { material_id: materialId },
    });
    if (!material) {
      throw new NotFoundException(`Material con ID ${materialId} no encontrado`);
    }

    const materialAulas = await this.materialAulaRepository.find({
      where: { material: { material_id: materialId } },
      relations: ['aula'],
    });

    return materialAulas.map(ma => ({
      material_aula_id: ma.material_aula_id,
      aula_id: ma.aula.aula_id,
      aula_nombre: `${ma.aula.grado} ${ma.aula.seccion}`,
      grado: ma.aula.grado,
      seccion: ma.aula.seccion,
      cantidad_asignada: ma.cantidad_asignada,
    }));
  }

  async assignAula(materialId: number, aulaId: number, cantidad: number): Promise<MaterialAula> {
    const material = await this.materialRepository.findOne({
      where: { material_id: materialId },
    });
    if (!material) {
      throw new NotFoundException(`Material con ID ${materialId} no encontrado`);
    }

    const aula = await this.aulaRepository.findOne({
      where: { aula_id: aulaId },
    });
    if (!aula) {
      throw new NotFoundException(`Aula con ID ${aulaId} no encontrado`);
    }

    const relacionExistente = await this.materialAulaRepository.findOne({
      where: {
        material: { material_id: materialId },
        aula: { aula_id: aulaId },
      },
    });

    if (relacionExistente) {
      throw new ConflictException('Este material ya está asignado a esta aula');
    }

    const totalAsignado = await this.getTotalAsignado(materialId);
    if (totalAsignado + cantidad > material.cantidad_total) {
      throw new ConflictException('La cantidad asignada excede la cantidad total disponible');
    }

    const nuevaRelacion = this.materialAulaRepository.create({
      material,
      aula,
      cantidad_asignada: cantidad,
    });

    return await this.materialAulaRepository.save(nuevaRelacion);
  }

  async removeAula(materialId: number, aulaId: number): Promise<void> {
    await this.materialRepository.findOneOrFail({
      where: { material_id: materialId },
    });

    const relacion = await this.materialAulaRepository.findOne({
      where: {
        material: { material_id: materialId },
        aula: { aula_id: aulaId },
      },
    });

    if (!relacion) {
      throw new NotFoundException('No se encontró la asignación de este material a esta aula');
    }

    await this.materialAulaRepository.remove(relacion);
  }

  // ============ MÉTODOS PARA ESTUDIANTES ============

  async getEstudiantesAsignados(materialId: number): Promise<any[]> {
    const material = await this.materialRepository.findOne({
      where: { material_id: materialId },
    });
    if (!material) {
      throw new NotFoundException(`Material con ID ${materialId} no encontrado`);
    }

    const materialEstudiantes = await this.materialEstudianteRepository.find({
      where: { material: { material_id: materialId } },
      relations: ['estudiante'],
    });

    return materialEstudiantes.map(me => ({
      material_estudiante_id: me.material_estudiante_id,
      estudiante_id: me.estudiante.estudiante_id,
      estudiante_nombre: `${me.estudiante.nombres} ${me.estudiante.apellido_paterno}`,
      dni: me.estudiante.dni,
      cantidad_asignada: me.cantidad_asignada,
      estado: me.estado,
    }));
  }

  async assignEstudiante(
    materialId: number,
    estudianteId: number,
    cantidad: number,
    estado: string = 'Asignado'
  ): Promise<MaterialEstudiante> {
    const material = await this.materialRepository.findOne({
      where: { material_id: materialId },
    });
    if (!material) {
      throw new NotFoundException(`Material con ID ${materialId} no encontrado`);
    }

    if (material.tipo !== MaterialTipo.TRABAJO) {
      throw new ConflictException('Solo los materiales de tipo TRABAJO pueden asignarse a estudiantes');
    }

    const estudiante = await this.estudianteRepository.findOne({
      where: { estudiante_id: estudianteId },
    });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudianteId} no encontrado`);
    }

    const relacionExistente = await this.materialEstudianteRepository.findOne({
      where: {
        material: { material_id: materialId },
        estudiante: { estudiante_id: estudianteId },
      },
    });

    if (relacionExistente) {
      throw new ConflictException('Este material ya está asignado a este estudiante');
    }

    const totalAsignado = await this.getTotalAsignado(materialId);
    if (totalAsignado + cantidad > material.cantidad_total) {
      throw new ConflictException('La cantidad asignada excede la cantidad total disponible');
    }

    let estadoEnum: EstadoMaterialEstudiante;
    switch (estado) {
      case 'Asignado':
        estadoEnum = EstadoMaterialEstudiante.ASIGNADO;
        break;
      case 'Devuelto':
        estadoEnum = EstadoMaterialEstudiante.DEVUELTO;
        break;
      case 'Perdido':
        estadoEnum = EstadoMaterialEstudiante.PERDIDO;
        break;
      default:
        throw new ConflictException('Estado no válido');
    }

    const nuevaRelacion = this.materialEstudianteRepository.create({
      material,
      estudiante,
      cantidad_asignada: cantidad,
      estado: estadoEnum,
    });

    return await this.materialEstudianteRepository.save(nuevaRelacion);
  }

  async removeEstudiante(materialId: number, estudianteId: number): Promise<void> {
    await this.materialRepository.findOneOrFail({
      where: { material_id: materialId },
    });

    const relacion = await this.materialEstudianteRepository.findOne({
      where: {
        material: { material_id: materialId },
        estudiante: { estudiante_id: estudianteId },
      },
    });

    if (!relacion) {
      throw new NotFoundException('No se encontró la asignación de este material a este estudiante');
    }

    await this.materialEstudianteRepository.remove(relacion);
  }

  // ============ MÉTODOS DE BÚSQUEDA ============

  async buscarAula(query: string): Promise<any[]> {
    const aulas = await this.aulaRepository
      .createQueryBuilder('aula')
      .where('aula.grado ILIKE :query', { query: `%${query}%` })
      .orWhere('aula.seccion ILIKE :query', { query: `%${query}%` })
      .getMany();

    return aulas.map(aula => ({
      aula_id: aula.aula_id,
      grado: aula.grado,
      seccion: aula.seccion,
    }));
  }

  async buscarEstudiantePorDni(dni: string): Promise<any> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { dni },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con DNI ${dni} no encontrado`);
    }

    return {
      estudiante_id: estudiante.estudiante_id,
      dni: estudiante.dni,
      nombres: estudiante.nombres,
      apellido_paterno: estudiante.apellido_paterno,
      apellido_materno: estudiante.apellido_materno,
    };
  }

  // ============ OBTENER MATERIALES POR TIPO ============

  async findByTipo(tipo: MaterialTipo): Promise<any[]> {
    const materiales = await this.materialRepository.find({
      where: { tipo },
      relations: ['material_aulas', 'material_estudiantes'],
      order: { nombre: 'ASC' },
    });

    return materiales.map(m => {
      const asignadoAulas = m.material_aulas?.reduce((sum, ma) => sum + ma.cantidad_asignada, 0) || 0;
      const asignadoEstudiantes = m.material_estudiantes?.reduce((sum, me) => sum + me.cantidad_asignada, 0) || 0;
      return {
        material_id: m.material_id,
        nombre: m.nombre,
        cantidad_total: m.cantidad_total,
        cantidad_disponible: m.cantidad_total - asignadoAulas - asignadoEstudiantes,
        categoria: m.categoria,
      };
    });
  }

  // ============ ASIGNACIÓN MASIVA A ESTUDIANTES ============

  async bulkAssignEstudiantes(
    materialId: number,
    asignaciones: { estudiante_id: number; cantidad_asignada: number }[],
  ): Promise<{ asignados: number; errores: string[] }> {
    const material = await this.materialRepository.findOne({
      where: { material_id: materialId },
    });
    if (!material) {
      throw new NotFoundException(`Material con ID ${materialId} no encontrado`);
    }

    if (material.tipo !== MaterialTipo.TRABAJO) {
      throw new ConflictException('Solo los materiales de tipo TRABAJO pueden asignarse a estudiantes');
    }

    const cantidadTotal = asignaciones.reduce((sum, a) => sum + a.cantidad_asignada, 0);
    const totalAsignado = await this.getTotalAsignado(materialId);

    if (totalAsignado + cantidadTotal > material.cantidad_total) {
      throw new ConflictException(
        `La cantidad total a asignar (${cantidadTotal}) excede la disponibilidad. Disponible: ${material.cantidad_total - totalAsignado}`,
      );
    }

    const errores: string[] = [];
    let asignados = 0;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const asignacion of asignaciones) {
        const estudiante = await this.estudianteRepository.findOne({
          where: { estudiante_id: asignacion.estudiante_id },
        });
        if (!estudiante) {
          errores.push(`Estudiante con ID ${asignacion.estudiante_id} no encontrado`);
          continue;
        }

        const existente = await this.materialEstudianteRepository.findOne({
          where: {
            material: { material_id: materialId },
            estudiante: { estudiante_id: asignacion.estudiante_id },
          },
        });
        if (existente) {
          errores.push(`${estudiante.nombres} ${estudiante.apellido_paterno} ya tiene este material asignado`);
          continue;
        }

        const nuevaRelacion = this.materialEstudianteRepository.create({
          material,
          estudiante,
          cantidad_asignada: asignacion.cantidad_asignada,
          estado: EstadoMaterialEstudiante.ASIGNADO,
        });

        await queryRunner.manager.save(nuevaRelacion);
        asignados++;
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return { asignados, errores };
  }

  // ============ MÉTODOS AUXILIARES ============

  private async getTotalAsignado(materialId: number): Promise<number> {
    const totalAulas = await this.materialAulaRepository
      .createQueryBuilder('ma')
      .select('SUM(ma.cantidad_asignada)', 'total')
      .where('ma.material_id = :materialId', { materialId })
      .getRawOne();

    const totalEstudiantes = await this.materialEstudianteRepository
      .createQueryBuilder('me')
      .select('SUM(me.cantidad_asignada)', 'total')
      .where('me.material_id = :materialId', { materialId })
      .getRawOne();

    const totalA = parseFloat(totalAulas?.total || '0');
    const totalE = parseFloat(totalEstudiantes?.total || '0');

    return totalA + totalE;
  }
}