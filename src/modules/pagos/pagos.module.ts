import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from '../matriculas/entities/matricula.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Aula } from '../aulas/entities/aula.entity';
import { Padre } from '../padres/entities/padre.entity';
import { PadresModule } from '../padres/padres.module';
import { AulasModule } from '../aulas/aulas.module';
import { EstudiantesModule } from '../estudiantes/estudiantes.module';
import { Pagos } from './entities/pagos.entity';
import { MatriculasModule } from '../matriculas/matriculas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pagos, Matricula, Estudiante, Aula, Padre]),
    MatriculasModule,
    PadresModule,
    AulasModule,
    EstudiantesModule
  ],
    
  providers: [PagosService],
  controllers: [PagosController]
}) 
export class PagosModule {}
