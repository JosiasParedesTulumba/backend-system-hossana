import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PadresService } from './padres.service';
import { CreatePadreDto } from './dto/create-padre.dto';
import { UpdatePadreDto } from './dto/update-padre.dto';
import { ApiPeruService } from 'src/common/api-peru/api-peru.service';

@Controller('padres')
export class PadresController {

  constructor(
    private readonly padresService: PadresService,
    private readonly apiPeruService: ApiPeruService,
  ) { }

  @Post()
  async create(@Body() createPadreDto: CreatePadreDto) {
    return this.padresService.create(createPadreDto);
  }

  @Get()
  findAll() {
    return this.padresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.padresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePadreDto: UpdatePadreDto) {
    return this.padresService.update(+id, updatePadreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.padresService.remove(+id);
  }
}
