import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InformacionMedicaService } from './informacion-medica.service';
import { CreateInformacionMedicaDto } from './dto/create-informacion-medica.dto';
import { UpdateInformacionMedicaDto } from './dto/update-informacion-medica.dto';

@Controller('informacion-medica')
export class InformacionMedicaController {
  constructor(private readonly informacionMedicaService: InformacionMedicaService) {}

  @Post()
  create(@Body() createInformacionMedicaDto: CreateInformacionMedicaDto) {
    return this.informacionMedicaService.create(createInformacionMedicaDto);
  }

  @Get()
  findAll() {
    return this.informacionMedicaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.informacionMedicaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInformacionMedicaDto: UpdateInformacionMedicaDto) {
    return this.informacionMedicaService.update(+id, updateInformacionMedicaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.informacionMedicaService.remove(+id);
  }
}
