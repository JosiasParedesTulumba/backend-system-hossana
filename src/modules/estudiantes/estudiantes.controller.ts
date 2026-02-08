import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Estado } from './constants/estado.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) { }

  @Post()
  async create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.estudiantesService.findAll(paginationDto);
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

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.estudiantesService.findOne(id);
  }
  
  // @Get('dni/:dni')
  // findByDni(@Param('dni') dni: string) {
  //   return this.estudiantesService.findByDni(dni);
  // }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEstudianteDto: UpdateEstudianteDto) {
  //   return this.estudiantesService.update(+id, updateEstudianteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.estudiantesService.remove(+id);
  // }

}
