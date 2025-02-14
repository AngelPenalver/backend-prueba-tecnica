import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
const jwtConstants ={ secret: 'clave_secreta'}
@Module({
  imports: [UsersModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: "60min" },
  }),],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
