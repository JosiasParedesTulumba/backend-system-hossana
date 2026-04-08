import { Module } from '@nestjs/common';
import { InformacionMedicaService } from './informacion-medica.service';
import { InformacionMedicaController } from './informacion-medica.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformacionMedica } from './entities/informacion-medica.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InformacionMedica, Estudiante])
  ],
  controllers: [InformacionMedicaController],
  providers: [InformacionMedicaService],
  exports: [InformacionMedicaService]
})
export class InformacionMedicaModule { }
