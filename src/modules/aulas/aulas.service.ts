import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Aula } from './entities/aula.entity';
import { Repository } from 'typeorm';
import { NivelEducativo } from './constants/nivel-educativo.enum';

@Injectable()
export class AulasService {

  constructor(
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>
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
        aula_id: 'DESC'
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
}
