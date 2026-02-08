import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { 
        // this.generarHash();
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;

        const user = await this.userRepository.findOne({
            where: { username },
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Comparar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('Password ingresado:', password);
        console.log('Password en BD:', user.password);
        console.log('Resultado bcrypt:', isPasswordValid);


        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generar token JWT
        const payload = { user_id: user.user_id, username: user.username };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            },
        };

    }

    async validateUser(user_id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { user_id },
        });

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        return user;
    }

    // async generarHash() {
    //     const hash = await bcrypt.hash('1234', 10);
    //     console.log('HASH:', hash);
    // }

}