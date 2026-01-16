import { Injectable } from '@nestjs/common';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MaterialesService {

  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async create(createMaterialeDto: CreateMaterialeDto) {
    const newMaterial = this.materialRepository.create(createMaterialeDto);
    await this.materialRepository.save(newMaterial);
  }

  findAll() {
    return `This action returns all materiales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materiale`;
  }

  update(id: number, updateMaterialeDto: UpdateMaterialeDto) {
    return `This action updates a #${id} materiale`;0
  }

  remove(id: number) {
    return `This action removes a #${id} materiale`;
  }
}
