import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { hashSync, compare } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register({ password, email }: RegisterDto) {
    const userFound = await this.usersService.findOneByEmail(email);

    if (userFound) {
      throw new BadRequestException('Correo electronico ya existe');
    }

    const hashedPassword = await hashSync(password, 10);

    await this.usersService.create({
      email,
      password: hashedPassword,
    });

    const user = await this.usersService.findOneByEmail(email);
    const id = user?.id;
    const payload = {
      id,
      email,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      email,
      token,
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Correo invalido');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña invalida');
    }
    const { id } = user;
    const payload = {
      id,
      email,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      email: user.email,
      token,
    };
  }
}
