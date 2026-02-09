import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePadreDto } from './dto/create-padre.dto';
import { UpdatePadreDto } from './dto/update-padre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Padre } from './entities/padre.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { EstudiantePadre } from '../estudiantes/entities/estudiante-padre.entity';

@Injectable()
export class PadresService {

  private readonly logger = new Logger(PadresService.name);

  constructor(
    @InjectRepository(Padre)
    private readonly padreRepository: Repository<Padre>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(EstudiantePadre)
    private readonly estudiantePadreRepository: Repository<EstudiantePadre>
  ) { }

  async create(createPadreDto: CreatePadreDto): Promise<Padre> {

    const padreexistentedni = await this.padreRepository.findOne({
      where: { dni: createPadreDto.dni }
    });

    if (padreexistentedni) {
      throw new ConflictException(`Padre con dni ${createPadreDto.dni} existente`);
    }

    const padreexistetelefono = await this.padreRepository.findOne({
      where: { telefono: createPadreDto.telefono }
    });

    if (padreexistetelefono) {
      throw new ConflictException(`Padre con telefono ${createPadreDto.telefono} existente`);
    }

    const padreexisteemail = await this.padreRepository.findOne({
      where: { email: createPadreDto.email }
    });

    if (padreexisteemail) {
      throw new ConflictException(`Padre con email ${createPadreDto.email} existente`);
    }

    const newPadre = this.padreRepository.create(createPadreDto);
    return await this.padreRepository.save(newPadre)
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;

    const skip = (page - 1) * limit;

    const [data, total] = await this.padreRepository.findAndCount({
      take: limit, skip,
      order: {
        padre_id: 'DESC',
      },
    });

    return {
      data,
      meta: {
        total, page, limit,
        lastPage: Math.ceil(total / limit),
      }
    }
  }

  async findOne(id: number): Promise<Padre> {
    const padre = await this.padreRepository.findOne({
      where: { padre_id: id },
      relations: ['estudiante_padre', 'estudiante_padre.estudiante']
    });
    if (!padre) throw new NotFoundException(`Padre con ID ${id} no encontrado`);
    return padre;
  }

  async findByDni(dni: string): Promise<Padre> {
    const padre = await this.padreRepository.findOne({
      where: { dni }
    });

    if (!padre) {
      throw new NotFoundException('Padre no encontrado');
    }

    return padre;
  }

  async update(padre_id: number, updatePadreDto: UpdatePadreDto): Promise<Padre> {
    const padre = await this.padreRepository.findOne({
      where: { padre_id }
    });

    if (!padre) {
      throw new NotFoundException('Padre no encontrado')
    }

    const updatePadre = this.padreRepository.merge(
      padre,
      updatePadreDto
    );

    return await this.padreRepository.save(updatePadre);

  }

  async remove(padre_id: number) {

    const padre = await this.padreRepository.findOne({
      where: { padre_id }
    });

    if (!padre) {
      throw new NotFoundException('Padre no encontrado');
    }

    await this.padreRepository.softDelete(padre_id);
    return {
      message: "Padre eliminado Correctamente (SoftDelete)"
    }
  }

  // ==================== MÉTODOS PARA ASIGNACIÓN DE ESTUDIANTES ====================

  /**
   * Buscar estudiante por DNI
   */
  async findEstudianteByDni(dni: string): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { dni }
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con DNI ${dni} no encontrado`);
    }

    return estudiante;
  }

  /**
   * Asignar estudiante a un padre
   */
  /**
 * Asignar estudiante a un padre
 */
  async assignEstudiante(
    padre_id: number,
    estudiante_id: number
  ): Promise<EstudiantePadre> {

    this.logger.log(`Asignando estudiante ${estudiante_id} a padre ${padre_id}`);

    // Verificar que el padre existe
    const padre = await this.findOne(padre_id);

    // Verificar que el estudiante existe
    const estudiante = await this.estudianteRepository.findOne({
      where: { estudiante_id }
    });

    if (!estudiante) {
      throw new NotFoundException(
        `Estudiante con ID ${estudiante_id} no encontrado`
      );
    }

    // Verificar que la relación no existe ya
    const relacionExistente = await this.estudiantePadreRepository.findOne({
      where: {
        estudiante: { estudiante_id },
        padre: { padre_id }
      }
    });

    if (relacionExistente) {
      throw new ConflictException(
        'Este estudiante ya está asignado a este padre'
      );
    }

    // Crear la relación (sin es_contacto_principal)
    const nuevaRelacion = this.estudiantePadreRepository.create({
      estudiante,
      padre,
    });

    const relacionGuardada = await this.estudiantePadreRepository.save(nuevaRelacion);

    this.logger.log(
      `Estudiante ${estudiante_id} asignado exitosamente a padre ${padre_id}`
    );

    return relacionGuardada;
  }

  /**
   * Obtener todos los estudiantes asignados a un padre
   */
  async getEstudiantesAsignados(padre_id: number) {
    // Verificar que el padre existe
    const padre = await this.findOne(padre_id);

    const relaciones = await this.estudiantePadreRepository.find({
      where: { padre: { padre_id } },
      relations: ['estudiante']
    });

    return relaciones.map(relacion => ({
      estudiante_id: relacion.estudiante.estudiante_id,
      dni: relacion.estudiante.dni,
      nombres: relacion.estudiante.nombres,
      apellido_paterno: relacion.estudiante.apellido_paterno,
      apellido_materno: relacion.estudiante.apellido_materno,
      // La propiedad ahora viene del padre, no de la relación
      es_contacto_principal: padre.es_contacto_principal
    }));
  }

  /**
   * Eliminar asignación de estudiante
   */
  async removeEstudiante(padre_id: number, estudiante_id: number) {
    // Verificar que el padre existe
    await this.findOne(padre_id);

    // Buscar la relación
    const relacion = await this.estudiantePadreRepository.findOne({
      where: {
        padre: { padre_id },
        estudiante: { estudiante_id }
      }
    });

    if (!relacion) {
      throw new NotFoundException('No se encontró la asignación de este estudiante a este padre');
    }

    // Eliminar la relación
    await this.estudiantePadreRepository.remove(relacion);

    return {
      message: 'Estudiante desasignado exitosamente'
    };
  }
}
