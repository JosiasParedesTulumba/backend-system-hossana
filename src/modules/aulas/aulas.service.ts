import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Aula } from './entities/aula.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    await this.aulaRepository.find();
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

  remove(id: number) {
    return `This action removes a #${id} aula`;
  }
}
