import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // Extrae el token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // No ignorar la expiracion del token
            ignoreExpiration: false,
            // Clave secreta para verificar la firma del token JWT
            secretOrKey: jwtConstants.secret
        });
    }    

    // Metodo validate se utiliza para validar el payload del token JWT
    async validate(payload: JwtPayload): Promise<JwtPayload> {
        return {
            sub: payload.sub,
            username: payload.username,
            rol: payload.rol,
        };
    }

}
interface JwtPayload {
    sub: string;
    username: string;
    rol: string;
}