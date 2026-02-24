import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {UsersService} from "../core/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET ?? 'Secret_Key_Chic_&_Cute_Back_022506'
        });
    }

    async validate(payload: any) {
        const userResponse = await this.userService.findByIdToValidateToken(payload.sub);

        if (payload.tokenVersion !== userResponse.user.tokenVersion) {
            throw new UnauthorizedException('Token inválido debido a cambio de contraseña');
        }

        return { id: payload.sub };
    }
}