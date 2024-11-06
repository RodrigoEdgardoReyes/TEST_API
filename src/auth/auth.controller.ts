// Importar modulos decoradores necesarios desde @nestjs/common
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
// Importar el AuthService que tiene la logica de autenticacion
import { AuthService } from "./auth.service";
// Importar el DTO que define la estrutura de los datos de login
import { LoginAuthDto } from "./dto/auth-login.dto";

import { jwtAuthGuard } from 'src/auth/jwt.auth.guard';

// Definicion de ruta para este controlador
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Define la ruta POST /auth/login con un codigo de estado HTTP 200 OK
  @HttpCode(HttpStatus.OK)
  // Nombre de la ruta de la api
  @Post('login')
  signIn(@Body() loginDto: LoginAuthDto){
    // Llama al metodo Login del AuthService con los datos de login
    return this.authService.login(loginDto);
  }
}