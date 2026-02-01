import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
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

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.estudiantesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateEstudianteDto: UpdateEstudianteDto) {
    return this.estudiantesService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.estudiantesService.softDelete(id);
  }
}
