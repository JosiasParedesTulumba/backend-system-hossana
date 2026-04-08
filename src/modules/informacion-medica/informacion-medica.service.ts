import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInformacionMedicaDto } from './dto/create-informacion-medica.dto';
import { UpdateInformacionMedicaDto } from './dto/update-informacion-medica.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InformacionMedica } from './entities/informacion-medica.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InformacionMedicaService {

  constructor(
    @InjectRepository(InformacionMedica)
    private readonly informacionMedicaRepository: Repository<InformacionMedica>
  ) { }

  async create(dto: CreateInformacionMedicaDto): Promise<InformacionMedica> {
    // Verificar si el estudiante ya tiene un registro médico
    const existente = await this.informacionMedicaRepository.findOne({
      where: { estudiante: { estudiante_id: dto.estudiante_id } }
    });

    if (existente) {
      throw new BadRequestException('Este estudiante ya tiene un registro médico. Puedes editarlo desde la lista.');
    }

    const nuevo = this.informacionMedicaRepository.create({
      condicion: dto.condicion,
      tipo_condicion: dto.tipo_condicion,
      gravedad: dto.gravedad,
      descripcion: dto.descripcion,
      estudiante: { estudiante_id: dto.estudiante_id } as any
    });

    return await this.informacionMedicaRepository.save(nuevo);
  }

  async findAll(): Promise<InformacionMedica[]> {
    return await this.informacionMedicaRepository.find({
      relations: ['estudiante', 'estudiante.padres'],
      order: { informacion_medica_id: 'DESC' }
    });
  }

  async findOne(id: number): Promise<InformacionMedica> {
    const registro = await this.informacionMedicaRepository.findOne({
      where: { informacion_medica_id: id },
      relations: ['estudiante', 'estudiante.padres']
    });

    if (!registro) {
      throw new NotFoundException(`Registro médico #${id} no encontrado`);
    }

    return registro;
  }

  async update(id: number, dto: UpdateInformacionMedicaDto): Promise<InformacionMedica> {
    const registro = await this.findOne(id);

    if (dto.condicion !== undefined) registro.condicion = dto.condicion;
    if (dto.tipo_condicion !== undefined) registro.tipo_condicion = dto.tipo_condicion;
    if (dto.gravedad !== undefined) registro.gravedad = dto.gravedad;
    if (dto.descripcion !== undefined) registro.descripcion = dto.descripcion;

    return await this.informacionMedicaRepository.save(registro);
  }

  async remove(id: number): Promise<void> {
    const registro = await this.findOne(id);
    await this.informacionMedicaRepository.remove(registro);
  }
}
