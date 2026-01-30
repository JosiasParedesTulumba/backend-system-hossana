import { Injectable } from '@nestjs/common';
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
    const newAula = this.aulaRepository.create(createAulaDto);
    return await this.aulaRepository.save(newAula);
  }

  async findAll(): Promise<Aula[]> {
    return await this.aulaRepository.find({
      order: {
        aula_id: 'DESC'
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} aula`;
  }

  update(id: number, updateAulaDto: UpdateAulaDto) {
    return `This action updates a #${id} aula`;
  }

  remove(id: number) {
    return `This action removes a #${id} aula`;
  }
}
