import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { AulasModule } from './modules/aulas/aulas.module';
import { UsersModule } from './modules/users/users.module';
import { MaterialesModule } from './modules/materiales/materiales.module';
import { EstudiantesModule } from './modules/estudiantes/estudiantes.module';
import { PadresModule } from './modules/padres/padres.module';
import { PrestamosModule } from './modules/prestamos/prestamos.module';
import { MatriculasModule } from './modules/matriculas/matriculas.module';
import { ApiPeruModule } from './common/api-peru/api-peru.module';
import { InformacionMedicaModule } from './modules/informacion-medica/informacion-medica.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      logging: true
    }),
    AuthModule,
    AulasModule,
    UsersModule,
    MaterialesModule,
    EstudiantesModule,
    PadresModule,
    PrestamosModule,
    MatriculasModule,
    ApiPeruModule,
    InformacionMedicaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
