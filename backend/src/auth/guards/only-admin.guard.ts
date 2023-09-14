import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoleEnum } from 'src/user/entities/user.entity';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const { user } = context.switchToHttp().getRequest();
        return user?.role == UserRoleEnum.ADMIN;
    }
}
