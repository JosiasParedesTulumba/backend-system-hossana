import { PartialType } from '@nestjs/mapped-types';
import { CreateInformacionMedicaDto } from './create-informacion-medica.dto';

export class UpdateInformacionMedicaDto extends PartialType(CreateInformacionMedicaDto) {}
