import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { EstadoMatricula } from './constants/estado-matricula.enum';
import { EstudiantesService } from '../estudiantes/estudiantes.service';
import { PadresService } from '../padres/padres.service';
import { AulasService } from '../aulas/aulas.service';
import { NivelEducativo } from '../aulas/constants/nivel-educativo.enum';

@Controller('matriculas')
export class MatriculasController {
  constructor(
    private readonly matriculasService: MatriculasService,
    private readonly estudiantesService: EstudiantesService,
    private readonly padreService: PadresService,
    private readonly aulasService: AulasService,
  ) { }

  @Post()
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculasService.create(createMatriculaDto);
  }

  @Get()
  findAll() {
    return this.matriculasService.findAll();
  }

  @Get('buscar')
  findByNivelGradoSeccion(
    @Query('nivel') nivel: NivelEducativo,
    @Query('grado') grado: string,
    @Query('seccion') seccion: string
  ) {
    return this.aulasService.findByNivelGradoSeccion(
      nivel,
      grado,
      seccion
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatriculaDto: UpdateMatriculaDto
  ) {
    return this.matriculasService.update(+id, updateMatriculaDto)
  }

  @Put('estado/:id')
  cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: EstadoMatricula
  ) {
    return this.matriculasService.cambiarEstado(+id, estado)
  }

  @Get('estudiante/:dni')
  findByDniEstudiante(@Param('dni') dni: string) {
    return this.estudiantesService.findByDni(dni);
  }

  @Get('padre/:dni')
  findByDniPadre(@Param('dni') dni: string) {
    return this.padreService.findByDni(dni);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculasService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMatriculaDto: UpdateMatriculaDto) {
  //   return this.matriculasService.update(+id, updateMatriculaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.matriculasService.remove(+id);
  // }
}
