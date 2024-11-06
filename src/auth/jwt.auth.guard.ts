// Importar el decorador injectable desde @nestjs/common
import { Injectable } from "@nestjs/common";
// Importar AuthGuard desde @nestjs/passport
import { AuthGuard } from "@nestjs/passport";

// Marcar la clase como inyectable para que pueda ser utilizada en el sistema
@Injectable()
export class jwtAuthGuard extends AuthGuard('jwt') { }