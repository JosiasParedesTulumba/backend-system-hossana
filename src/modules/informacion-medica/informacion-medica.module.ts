import { Module } from '@nestjs/common';
import { InformacionMedicaService } from './informacion-medica.service';
import { InformacionMedicaController } from './informacion-medica.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformacionMedica } from './entities/informacion-medica.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InformacionMedica])
  ],
  controllers: [InformacionMedicaController],
  providers: [InformacionMedicaService],
})
export class InformacionMedicaModule { }
