import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Estado } from './constants/estado.enum';

@Injectable()
export class EstudiantesService {

  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>
  ) { }

  // Crear un nuevo estudiante
  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    const newEstudiante = this.estudianteRepository.create(createEstudianteDto);
    return await this.estudianteRepository.save(newEstudiante);
  }

  // Obtener todos los estudiantes
  async findAll(paginationDto: PaginationDto): Promise<Estudiante[]> {
    return await this.estudianteRepository.find({
      order: {
        estudiante_id: 'DESC',
      },
    });
  }

  //Obtener activos
  async findActivos(): Promise<Estudiante[]> {
    return await this.estudianteRepository.find({ where: { estado: Estado.ACTIVO } })
  }

  //Actualizar un estudiante
  async update(id: number, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({ where: { estudiante_id: id } });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    Object.assign(estudiante, updateEstudianteDto);
    return await this.estudianteRepository.save(estudiante);
  }

  //Cambiar estado
  async cambiarEstado(id: number, estado: Estado): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({ where: { estudiante_id: id } })
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    estudiante.estado = estado;
    return await this.estudianteRepository.save(estudiante)
  }

  //buscar con dni
  async findByDni(dni: string): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { dni }
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return estudiante;
  }

  // Obtener un estudiante por ID
  async findOne(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { estudiante_id: id }
    });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    return estudiante;
  }

  //nombre completo
  async getNombreEstudiante(id: number): Promise<string> {
    const estudiante = await this.findOne(id);
    return `${estudiante.nombres} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`;
  }

  // Eliminar estudiante (físico)
  async remove(id: number): Promise<void> {
    const estudiante = await this.findOne(id);
    await this.estudianteRepository.remove(estudiante);
  }

}
