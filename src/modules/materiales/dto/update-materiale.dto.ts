import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDto } from './create-materiale.dto';

export class UpdateMaterialeDto extends PartialType(CreateMaterialDto) { }
