import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { MaterialTipo } from './constants/material-tipo.enum';

@Controller('materiales')
export class MaterialesController {
  constructor(private readonly materialesService: MaterialesService) { }

  @Post()
  create(@Body() createMaterialeDto: CreateMaterialDto) {
    return this.materialesService.create(createMaterialeDto);
  }

  @Get()
  findAll(@Query() paginar: PaginationDto) {
    return this.materialesService.findAll(paginar);
  }

  // ============ ENDPOINTS DE BÚSQUEDA (antes de /:id para evitar conflictos) ============

  @Get('tipo/:tipo')
  async findByTipo(@Param('tipo') tipo: MaterialTipo) {
    return this.materialesService.findByTipo(tipo);
  }

  @Get('buscar-aula/:query')
  async buscarAula(@Param('query') query: string) {
    return this.materialesService.buscarAula(query);
  }

  @Get('buscar-estudiante/:dni')
  async buscarEstudiante(@Param('dni') dni: string) {
    return this.materialesService.buscarEstudiantePorDni(dni);
  }

  // ============ CRUD BÁSICO ============

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMaterialeDto: UpdateMaterialeDto) {
    return this.materialesService.update(id, updateMaterialeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialesService.remove(id);
  }

  // ============ ENDPOINTS PARA AULAS ============

  @Get(':id/aulas')
  async getAulasAsignadas(@Param('id', ParseIntPipe) id: number) {
    return this.materialesService.getAulasAsignadas(id);
  }

  @Post(':id/aulas')
  async assignAula(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { aula_id: number; cantidad_asignada: number }
  ) {
    return this.materialesService.assignAula(id, body.aula_id, body.cantidad_asignada);
  }

  @Delete(':id/aulas/:aulaId')
  async removeAula(
    @Param('id', ParseIntPipe) id: number,
    @Param('aulaId', ParseIntPipe) aulaId: number
  ) {
    return this.materialesService.removeAula(id, aulaId);
  }

  // ============ ENDPOINTS PARA ESTUDIANTES ============

  @Get(':id/estudiantes')
  async getEstudiantesAsignados(@Param('id', ParseIntPipe) id: number) {
    return this.materialesService.getEstudiantesAsignados(id);
  }

  @Post(':id/estudiantes')
  async assignEstudiante(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { estudiante_id: number; cantidad_asignada: number; estado: string }
  ) {
    return this.materialesService.assignEstudiante(
      id,
      body.estudiante_id,
      body.cantidad_asignada,
      body.estado
    );
  }

  @Post(':id/estudiantes/bulk')
  async bulkAssignEstudiantes(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { asignaciones: { estudiante_id: number; cantidad_asignada: number }[] }
  ) {
    return this.materialesService.bulkAssignEstudiantes(id, body.asignaciones);
  }

  @Delete(':id/estudiantes/:estudianteId')
  async removeEstudiante(
    @Param('id', ParseIntPipe) id: number,
    @Param('estudianteId', ParseIntPipe) estudianteId: number
  ) {
    return this.materialesService.removeEstudiante(id, estudianteId);
  }
}
