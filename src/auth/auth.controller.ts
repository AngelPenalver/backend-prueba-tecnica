import {
  BadGatewayException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Usuario registrado con éxito',
        data: user,
      };
    } catch (error) {
      throw new BadGatewayException(
        'Error al registrar al usuario: ' + error.message,
      );
    }
  }
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    try {
        const user = await this.authService.login(loginDto)
        if(!user){
            throw new UnauthorizedException('Correo electronico o contraseña incorrecta')
        }
        return {
            statusCode: HttpStatus.OK,
            message: "Login exitoso!",
            data: user
        }
    } catch (error) {
        throw new BadGatewayException('Error al intentar loguear ' + error.message)
    }
  }
}
