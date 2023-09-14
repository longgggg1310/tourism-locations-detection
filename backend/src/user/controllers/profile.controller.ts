import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthUser } from '../decorators/user.decorator';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { FullUserDto } from '../dto/full-user.dto';

@ApiBearerAuth('defaultToken')
@ApiTags('Profile')
@Controller('profile')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
    constructor(private readonly userService: UserService) {}

    @Get('verify/:id/:token')
    async verifyUserEmail(@Param('id', new ParseIntPipe()) id: number, @Param('token') token: string) {
        return await this.userService.verifyUserEmail(id, token);
    }

    @UseGuards(JWTAuthGuard)
    @Post('verify')
    async sendVerifyEmail(@AuthUser() user: User) {
        return this.userService.sendVerifyEmail(user);
    }

    @UseGuards(JWTAuthGuard)
    @ApiOkResponse({ type: FullUserDto, description: 'Get info my profile' })
    @Get('my')
    async getMyUser(@AuthUser() user: User): Promise<FullUserDto> {
        if (!user.id) {
            throw new BadRequestException('User not found');
        }
        const data = await this.userService.findUserWithStore(user.id);
        return data;
    }
}
