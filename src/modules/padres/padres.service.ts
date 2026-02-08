import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePadreDto } from './dto/create-padre.dto';
import { UpdatePadreDto } from './dto/update-padre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Padre } from './entities/padre.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PadresService {

  constructor(
    @InjectRepository(Padre)
    private readonly padreRepository: Repository<Padre>
  ) { }

  async create(createPadreDto: CreatePadreDto): Promise<Padre> {

    const padreexistentedni = await this.padreRepository.findOne({
      where: {dni: createPadreDto.dni}
    });

    if(padreexistentedni){
      throw new ConflictException(`Padre con dni ${createPadreDto.dni} existente`);
    }

    const padreexistetelefono = await this.padreRepository.findOne({
      where: {telefono: createPadreDto.telefono}
    });

    if(padreexistetelefono){
      throw new ConflictException(`Padre con telefono ${createPadreDto.telefono} existente`);
    }

    const padreexisteemail = await this.padreRepository.findOne({
      where: {email: createPadreDto.email}
    });

    if(padreexisteemail){
      throw new ConflictException(`Padre con email ${createPadreDto.email} existente`);
    }

    const newPadre = this.padreRepository.create(createPadreDto);
    return await this.padreRepository.save(newPadre)
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;

    const skip = (page - 1) * limit;

    const [data, total] = await this.padreRepository.findAndCount({
      take: limit, skip,
      order: {
        padre_id: 'DESC',
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

  async findOne(id: number): Promise<Padre> {
    const padre = await this.padreRepository.findOneBy({ padre_id: id });
    if (!padre) throw new NotFoundException(`Padre con ID ${id} no encontrado`);
    return padre;
  }

  async findByDni(dni: string): Promise<Padre> {
    const padre = await this.padreRepository.findOne({
      where: { dni }
    });

    if (!padre) {
      throw new NotFoundException('Padre no encontrado');
    }

    return padre;
  }

  async update(padre_id: number, updatePadreDto: UpdatePadreDto): Promise<Padre> {
    const padre = await this.padreRepository.findOne({
      where: {padre_id}
    });

    if(!padre){
      throw new NotFoundException('Padre no encontrado')
    }

    const updatePadre = this.padreRepository.merge(
      padre,
      updatePadreDto
    );

    return await this.padreRepository.save(updatePadre);

  }

  async remove(padre_id: number) {

    const padre = await this.padreRepository.findOne({
      where: { padre_id }
    });

    if (!padre) {
      throw new NotFoundException('Padre no encontrado');
    }

    await this.padreRepository.softDelete(padre_id);
    return {
      message: "Padre eliminado Correctamente (SoftDelete)"
    }
  }
}
