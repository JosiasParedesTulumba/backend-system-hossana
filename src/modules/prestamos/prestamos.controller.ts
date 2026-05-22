import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) { }

  // ============ CRUD BÁSICO ============

  @Post()
  create(@Body() createPrestamoDto: CreatePrestamoDto) {
    return this.prestamosService.create(createPrestamoDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.prestamosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePrestamoDto: UpdatePrestamoDto) {
    return this.prestamosService.update(id, updatePrestamoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.remove(id);
  }

  // ============ ENDPOINTS ESPECÍFICOS ============

  @Get('aula/:aulaId/activos')
  findPrestamosActivos(@Param('aulaId', ParseIntPipe) aulaId: number) {
    return this.prestamosService.findPrestamosActivos(aulaId);
  }

  @Get('aula/:aulaId/realizados')
  findPrestamosRealizados(@Param('aulaId', ParseIntPipe) aulaId: number) {
    return this.prestamosService.findPrestamosRealizados(aulaId);
  }

  @Get('aula/:aulaId/recibidos')
  findPrestamosRecibidos(@Param('aulaId', ParseIntPipe) aulaId: number) {
    return this.prestamosService.findPrestamosRecibidos(aulaId);
  }

  @Get('vencidos/all')
  findVencidos() {
    return this.prestamosService.findVencidos();
  }

  @Patch(':id/devolver')
  devolverPrestamo(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.devolverPrestamo(id);
  }
}