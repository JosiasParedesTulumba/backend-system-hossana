import { Injectable } from '@nestjs/common';
import { CreatePadreDto } from './dto/create-padre.dto';
import { UpdatePadreDto } from './dto/update-padre.dto';

@Injectable()
export class PadresService {
  create(createPadreDto: CreatePadreDto) {
    return 'This action adds a new padre';
  }

  findAll() {
    return `This action returns all padres`;
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
