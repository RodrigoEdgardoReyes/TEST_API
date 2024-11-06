import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-auth.strategy';
import { jwtConstants } from './strategies/constant';

@Module({
  imports:[
    // Importar el modulo TypeOrmModule y registrar la entidad User
    TypeOrmModule.forFeature([User]),
    // Importar el modulo PassportModule para usar estrategias de autenticacion
    PassportModule.register({ defaultStrategy: 'jwt'}),
    // Importar el modulo JwtModule y configuramos las opciones de JWT
    JwtModule.register({
      global: true,
      // Clave secreta para firmar los tokens JWT 
      secret: jwtConstants.secret, 
      // Configuracion de la expiracion de los tokens a 24 horas
      signOptions: { expiresIn: "1h"}
    })
  ],
  // Registro el controlador de autenticacion
  controllers: [AuthController],
  // Registro los proveedores de servicios y estrategias de autenticacion
  providers: [AuthService, JwtStrategy],
  // Exportamos el servicio de autenticacion para que pueda ser usado en otros modulos
  exports: [AuthService]
})
export class AuthModule {}
