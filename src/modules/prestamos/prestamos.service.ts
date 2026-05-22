import { ConflictException, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Prestamo } from './entities/prestamo.entity';
import { Material } from '../materiales/entities/material.entity';
import { Aula } from '../aulas/entities/aula.entity';
import { MaterialAula } from '../materiales/entities/material-aula.entity';
import { EstadoPrestamo } from './constants/estado-prestamo.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PrestamosService {
  private readonly logger = new Logger(PrestamosService.name);

  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
    @InjectRepository(MaterialAula)
    private readonly materialAulaRepository: Repository<MaterialAula>,
  ) { }

  // ============ CRUD BÁSICO ============

  async create(createPrestamoDto: CreatePrestamoDto): Promise<Prestamo> {
    const { material_id, aula_origen_id, aula_destino_id, cantidad, fecha_devolucion_esperada } = createPrestamoDto;

    if (aula_origen_id === aula_destino_id) {
      throw new BadRequestException('No se puede prestar a la misma aula');
    }

    const material = await this.materialRepository.findOne({
      where: { material_id },
    });
    if (!material) {
      throw new NotFoundException(`Material con ID ${material_id} no encontrado`);
    }

    const aulaOrigen = await this.aulaRepository.findOne({
      where: { aula_id: aula_origen_id },
    });
    if (!aulaOrigen) {
      throw new NotFoundException(`Aula origen con ID ${aula_origen_id} no encontrada`);
    }

    const aulaDestino = await this.aulaRepository.findOne({
      where: { aula_id: aula_destino_id },
    });
    if (!aulaDestino) {
      throw new NotFoundException(`Aula destino con ID ${aula_destino_id} no encontrada`);
    }

    const materialAula = await this.materialAulaRepository.findOne({
      where: {
        material: { material_id },
        aula: { aula_id: aula_origen_id },
      },
    });

    if (!materialAula) {
      throw new ConflictException(
        `El aula origen no tiene el material ${material.nombre} asignado`
      );
    }

    if (materialAula.cantidad_asignada < cantidad) {
      throw new ConflictException(
        `Cantidad insuficiente. Disponible: ${materialAula.cantidad_asignada}`
      );
    }

    const nuevoPrestamo = new Prestamo();
    nuevoPrestamo.material = material;
    nuevoPrestamo.aula_origen = aulaOrigen;
    nuevoPrestamo.aula_destino = aulaDestino;
    nuevoPrestamo.cantidad = cantidad;
    nuevoPrestamo.fecha_devolucion_esperada = fecha_devolucion_esperada ? new Date(fecha_devolucion_esperada) : null;  // ✅ null en lugar de undefined
    nuevoPrestamo.estado = EstadoPrestamo.ACTIVO;

    return await this.prestamoRepository.save(nuevoPrestamo);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prestamoRepository.findAndCount({
      relations: ['material', 'aula_origen', 'aula_destino'],
      take: limit,
      skip,
      order: {
        prestamo_id: 'DESC',
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

  async findOne(id: number): Promise<Prestamo> {
    const prestamo = await this.prestamoRepository.findOne({
      where: { prestamo_id: id },
      relations: ['material', 'aula_origen', 'aula_destino'],
    });

    if (!prestamo) {
      throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
    }

    return prestamo;
  }

  async findPrestamosActivos(aulaId: number): Promise<Prestamo[]> {
    const aula = await this.aulaRepository.findOne({
      where: { aula_id: aulaId },
    });

    if (!aula) {
      throw new NotFoundException(`Aula con ID ${aulaId} no encontrada`);
    }

    return await this.prestamoRepository.find({
      where: [
        { aula_origen: { aula_id: aulaId }, estado: EstadoPrestamo.ACTIVO },
        { aula_destino: { aula_id: aulaId }, estado: EstadoPrestamo.ACTIVO },
      ],
      relations: ['material', 'aula_origen', 'aula_destino'],
      order: { fecha_prestamo: 'DESC' },
    });
  }

  async findPrestamosRealizados(aulaId: number): Promise<Prestamo[]> {
    return await this.prestamoRepository.find({
      where: { aula_origen: { aula_id: aulaId } },
      relations: ['material', 'aula_origen', 'aula_destino'],
      order: { fecha_prestamo: 'DESC' },
    });
  }

  async findPrestamosRecibidos(aulaId: number): Promise<Prestamo[]> {
    return await this.prestamoRepository.find({
      where: { aula_destino: { aula_id: aulaId } },
      relations: ['material', 'aula_origen', 'aula_destino'],
      order: { fecha_prestamo: 'DESC' },
    });
  }

  async findVencidos(): Promise<Prestamo[]> {
    const hoy = new Date();
    return await this.prestamoRepository.find({
      where: {
        estado: EstadoPrestamo.ACTIVO,
        fecha_devolucion_esperada: MoreThanOrEqual(new Date('1970-01-01')),
      },
      relations: ['material', 'aula_origen', 'aula_destino'],
    });
  }

  async devolverPrestamo(id: number): Promise<Prestamo> {
    const prestamo = await this.prestamoRepository.findOne({
      where: { prestamo_id: id },
      relations: ['material', 'aula_origen', 'aula_destino'],
    });

    if (!prestamo) {
      throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
    }

    if (prestamo.estado !== EstadoPrestamo.ACTIVO) {
      throw new ConflictException(
        `No se puede devolver un préstamo con estado ${prestamo.estado}`
      );
    }

    prestamo.estado = EstadoPrestamo.DEVUELTO;
    prestamo.fecha_devolucion = new Date();

    return await this.prestamoRepository.save(prestamo);
  }

  async update(id: number, updatePrestamoDto: UpdatePrestamoDto): Promise<Prestamo> {
    const prestamo = await this.prestamoRepository.findOne({
      where: { prestamo_id: id },
    });

    if (!prestamo) {
      throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
    }

    if (updatePrestamoDto.fecha_devolucion_esperada) {
      prestamo.fecha_devolucion_esperada = new Date(updatePrestamoDto.fecha_devolucion_esperada);
    }

    if (updatePrestamoDto.cantidad) {
      prestamo.cantidad = updatePrestamoDto.cantidad;
    }

    return await this.prestamoRepository.save(prestamo);
  }

  async remove(id: number) {
    const prestamo = await this.prestamoRepository.findOne({
      where: { prestamo_id: id },
    });

    if (!prestamo) {
      throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
    }

    await this.prestamoRepository.remove(prestamo);
    return { message: 'Préstamo eliminado correctamente' };
  }
}