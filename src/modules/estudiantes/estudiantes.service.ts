import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class EstudiantesService {

  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>
  ) { }

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {

    const existEstudianteDni = await this.estudianteRepository.findOne({
      where: { dni: createEstudianteDto.dni }
    });

    if (existEstudianteDni){
      throw new ConflictException(`El estudiante con ese dni ya existe`);
    }

    const existEstudianteEmail = await this.estudianteRepository.findOne({
      where: { email: createEstudianteDto.email }
    });

    if (existEstudianteEmail){
      throw new ConflictException(`El estudiante con ese email ya existe`);
    }

    const existEstudianteTelefono = await this.estudianteRepository.findOne({
      where: { telefono: createEstudianteDto.telefono }
    });

    if (existEstudianteTelefono){
      throw new ConflictException(`El estudiante con ese telefono ya existe`);
    }

    const newEstudiante = this.estudianteRepository.create(createEstudianteDto);
    
    return await this.estudianteRepository.save(newEstudiante);
  }

  async findAll( paginationDto: PaginationDto ) {
    const { page = 1, limit = 20 } = paginationDto;

    const skip = (page - 1) * limit;

    const [data, total] = await this.estudianteRepository.findAndCount({
      take: limit, skip,
      order: {
        estudiante_id: 'DESC',
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

  async findOne(estudiante_id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOneBy({estudiante_id})

    if (!estudiante){
      throw new NotFoundException('Estudiante no encontrado');
    }

    return estudiante;
  }

  async update(estudiante_id: number, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: {estudiante_id}
    });

    if (!estudiante){
      throw new NotFoundException('Estudiante no encontrado')
    }

    const updateEstudiante = this.estudianteRepository.merge(
      estudiante, 
      updateEstudianteDto
    );

    return await this.estudianteRepository.save(updateEstudiante);
  }

  async softDelete(estudiante_id: number) {
    const estudiante = this.estudianteRepository.findOne({
      where: {estudiante_id}
    });

    if (!estudiante) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.estudianteRepository.softDelete(estudiante_id);
    return {
      message: "Estudiante eliminado Correctamente (SoftDelete)"
    }
  }
}
