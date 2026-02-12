import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PadresService } from './padres.service';
import { CreatePadreDto } from './dto/create-padre.dto';
import { UpdatePadreDto } from './dto/update-padre.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('padres')
export class PadresController {

  constructor(
    private readonly padresService: PadresService,
  ) { }

  @Post()
  async create(@Body() createPadreDto: CreatePadreDto) {
    return this.padresService.create(createPadreDto);
  }

  @Get()
  async findAll(@Query() paginationDTO: PaginationDto) {
    return this.padresService.findAll(paginationDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.padresService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePadreDto: UpdatePadreDto) {
    return this.padresService.update(id, updatePadreDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.padresService.remove(id);
  }

  // ==================== ENDPOINTS PARA ASIGNACIÓN DE ESTUDIANTES ====================

  /**
   * Buscar estudiante por DNI
   */
  @Get('search-estudiante/:dni')
  async searchEstudiante(@Param('dni') dni: string) {
    return this.padresService.findEstudianteByDni(dni);
  }

  /**
 * Asignar estudiante a un padre
 * POST /api/padres/:id/estudiantes
 */
  @Post(':id/estudiantes')
  async assignEstudiante(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { estudiante_id: number }
  ) {
    return this.padresService.assignEstudiante(
      id,
      body.estudiante_id
    );
  }

  /**
   * Obtener estudiantes asignados a un padre
   */
  @Get(':id/estudiantes')
  async getEstudiantesAsignados(@Param('id') id: number) {
    return this.padresService.getEstudiantesAsignados(id);
  }

  /**
   * Eliminar asignación de estudiante
   */
  @Delete(':id/estudiantes/:estudiante_id')
  async removeEstudiante(
    @Param('id') id: number,
    @Param('estudiante_id') estudiante_id: number
  ) {
    return this.padresService.removeEstudiante(id, estudiante_id);
  }
}
