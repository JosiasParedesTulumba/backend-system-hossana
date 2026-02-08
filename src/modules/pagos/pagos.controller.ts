import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { MatriculasService } from '../matriculas/matriculas.service';
import { EstudiantesService } from '../estudiantes/estudiantes.service';
import { PadresService } from '../padres/padres.service';
import { AulasService } from '../aulas/aulas.service';
import { CreatePagosDto } from './dto/create-pagos.dto';
import { UpdatePagosDto } from './dto/update-pagos.dto';
import { NivelEducativo } from '../aulas/constants/nivel-educativo.enum';

@Controller('pagos')
export class PagosController {

    constructor(
        private readonly pagosService: PagosService,
        private readonly estudiantesService: EstudiantesService,
        private readonly aulasService: AulasService,
    ) { }

    @Get()
    findAll() {
        return this.pagosService.findAll();
    }

    @Get('estudiante/:id')
    getNombreEstudiante(
        @Param('id') id: string
    ): Promise<string> {
        return this.estudiantesService.getNombreEstudiante(+id);
    }


    @Get('aula/:id')
    async getNombreAula(@Param('id') id: string): Promise<string> {
        return await this.aulasService.getNombreAula(+id);
    }

    @Post()
    createPagos(@Body() createPagosDto: CreatePagosDto) {
        return this.pagosService.create(createPagosDto)
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePagosDto: UpdatePagosDto
    ) {
        return this.pagosService.update(+id, updatePagosDto)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pagosService.findOne(+id)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pagosService.remove(+id)
    }
}
