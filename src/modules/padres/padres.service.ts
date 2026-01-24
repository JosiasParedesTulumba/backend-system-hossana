import { Injectable } from '@nestjs/common';
import { CreatePadreDto } from './dto/create-padre.dto';
import { UpdatePadreDto } from './dto/update-padre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Padre } from './entities/padre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PadresService {

  constructor(
    @InjectRepository(Padre)
    private readonly padreRepository: Repository<Padre>
  ) { }

  async create(createPadreDto: CreatePadreDto) {
    const newPadre = this.padreRepository.create(createPadreDto);
    return this.padreRepository.save(newPadre);
  }

  async findAll() {
    return this.padreRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} padre`;
  }

  update(id: number, updatePadreDto: UpdatePadreDto) {
    return `This action updates a #${id} padre`;
  }

  remove(id: number) {
    return `This action removes a #${id} padre`;
  }
}
