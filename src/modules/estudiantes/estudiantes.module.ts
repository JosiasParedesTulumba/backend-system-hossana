import { Module } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { MaterialEstudiante } from '../materiales/entities/material-estudiante.entity';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { Matricula } from '../matriculas/entities/matricula.entity';
import { EstudiantePadre } from './entities/estudiante-padre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Estudiante,
      MaterialEstudiante,
      Prestamo,
      Matricula,
      EstudiantePadre
    ])
  ],
  controllers: [EstudiantesController],
  providers: [EstudiantesService],
  exports: [EstudiantesService],
})
export class EstudiantesModule { }
