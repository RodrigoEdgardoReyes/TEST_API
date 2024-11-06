import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  // Constructor donde se inyectan las dependecias necesarias
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ){}

   // Metodo asincronico que maneja el proceso de login
   async login({email, password}: LoginAuthDto){
    // Busca el usuario en la base de datos por email y estado activo, incluyendo relaciones
    const user = await this.userRepository.findOne({
      relations: {role:true},
      where: {
        email,
        isActive: true,
      },
    });
    // Si no se encuentra el usuario o la contraseña no coincide
    if(!user || !user.checkPassword(password)){
      return{
        message: "No se encontro el usuario",
        ok: false,
        status: HttpStatus.NOT_FOUND,
      }
    }

    // Elimina el password del objeto usuario para no incluirlo en la respuesta
    user.password = undefined;
    // Definimos el payload del JWT con informacion del usuario
    const payload = {
      _sub: user.id,
      _name: user.userName,
      _rol: user.role
    }
   

  //  Firma del token JWT con el payload definido
  const token = this.jwtService.sign(payload);

  // Retornar la respuesta con el token, el usuario y el estado HTTP OK
  return {ok: true, token, user, status: HttpStatus.OK};
}
}