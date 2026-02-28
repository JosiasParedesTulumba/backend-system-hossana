import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {

    const dni = createEstudianteDto.dni.trim();
    const nombres = createEstudianteDto.nombres.trim();
    const apellidoPaterno = createEstudianteDto.apellido_paterno.trim();
    const apellidoMaterno = createEstudianteDto.apellido_materno.trim();

    const existeDni = await this.estudianteRepository.findOne({
      where: { dni }
    });

    if (existeDni) {
      throw new BadRequestException('Ya existe un estudiante con ese DNI');
    }

    const existeNombre = await this.estudianteRepository.findOne({
      where: {
        nombres,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno
      }
    });

    if (existeNombre) {
      throw new BadRequestException('Ya existe un estudiante con el mismo nombre completo');
    }

    createEstudianteDto.dni = dni;
    createEstudianteDto.nombres = nombres;
    createEstudianteDto.apellido_paterno = apellidoPaterno;
    createEstudianteDto.apellido_materno = apellidoMaterno;

    try {
      const newEstudiante = this.estudianteRepository.create(createEstudianteDto);
      return await this.estudianteRepository.save(newEstudiante);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El DNI ya está registrado');
      }
      throw error;
    }
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

  // Actualizar estudiante
  async update(id: number, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante> {

    const estudiante = await this.estudianteRepository.findOne({
      where: { estudiante_id: id }
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Solo validar si están intentando cambiar el nombre completo
    if (
      updateEstudianteDto.nombres ||
      updateEstudianteDto.apellido_paterno ||
      updateEstudianteDto.apellido_materno
    ) {

      const nombres = (updateEstudianteDto.nombres ?? estudiante.nombres).trim();
      const apellidoPaterno = (updateEstudianteDto.apellido_paterno ?? estudiante.apellido_paterno).trim();
      const apellidoMaterno = (updateEstudianteDto.apellido_materno ?? estudiante.apellido_materno).trim();

      const existeNombre = await this.estudianteRepository.findOne({
        where: {
          nombres,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno
        }
      });

      if (existeNombre && existeNombre.estudiante_id !== id) {
        throw new BadRequestException('Ya existe un estudiante con el mismo nombre completo');
      }

      updateEstudianteDto.nombres = nombres;
      updateEstudianteDto.apellido_paterno = apellidoPaterno;
      updateEstudianteDto.apellido_materno = apellidoMaterno;
    }

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
