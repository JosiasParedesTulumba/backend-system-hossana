import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Estado } from './constants/estado.enum';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) { }

  @Post()
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  @Get()
  findAll() {
    return this.estudiantesService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.estudiantesService.update(+id, updateEstudianteDto);
  }

  @Put('estado/:id')
  cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: Estado,
  ) {
    return this.estudiantesService.cambiarEstado(+id, estado);
  }

  // @Get('dni/:dni')
  // findByDni(@Param('dni') dni: string) {
  //   return this.estudiantesService.findByDni(dni);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(+id);
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEstudianteDto: UpdateEstudianteDto) {
  //   return this.estudiantesService.update(+id, updateEstudianteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.estudiantesService.remove(+id);
  // }
}
