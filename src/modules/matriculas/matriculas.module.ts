import { Module } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { MatriculasController } from './matriculas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from './entities/matricula.entity';
import { Padre } from '../padres/entities/padre.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Aula } from '../aulas/entities/aula.entity';
import { EstudiantesModule } from '../estudiantes/estudiantes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Matricula, Estudiante, Aula, Padre]),
    EstudiantesModule
  ],
  controllers: [MatriculasController],
  providers: [MatriculasService],
})
export class MatriculasModule {}
