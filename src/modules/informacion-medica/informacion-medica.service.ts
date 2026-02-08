import { Injectable } from '@nestjs/common';
import { CreateInformacionMedicaDto } from './dto/create-informacion-medica.dto';
import { UpdateInformacionMedicaDto } from './dto/update-informacion-medica.dto';

@Injectable()
export class InformacionMedicaService {
  create(createInformacionMedicaDto: CreateInformacionMedicaDto) {
    return 'This action adds a new informacionMedica';
  }

  findAll() {
    return `This action returns all informacionMedica`;
  }

  findOne(id: number) {
    return `This action returns a #${id} informacionMedica`;
  }

  update(id: number, updateInformacionMedicaDto: UpdateInformacionMedicaDto) {
    return `This action updates a #${id} informacionMedica`;
  }

  remove(id: number) {
    return `This action removes a #${id} informacionMedica`;
  }
}
