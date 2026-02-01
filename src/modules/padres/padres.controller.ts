import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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
}
