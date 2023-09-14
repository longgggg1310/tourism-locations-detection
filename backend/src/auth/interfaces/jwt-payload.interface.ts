import { User } from '../../user/entities/user.entity';

export interface JwtPayload {
    user: User;
    sub: string;
    iat: number;
    exp: number;
}
