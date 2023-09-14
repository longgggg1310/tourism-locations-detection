import { AuthService } from './auth.service';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Logger,
    UseInterceptors,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
    Render,
} from '@nestjs/common';
import { SignUp } from './dto/sign-up.dto';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthDto } from './dto/auth.dto';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/user/decorators/user.decorator';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiBody({ type: SignUp })
    @HttpCode(HttpStatus.CREATED)
    register(@Body() signUp: SignUp): Promise<User> {
        return this.authService.register(signUp);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({ description: 'login success', type: AuthDto })
    @ApiUnauthorizedResponse({ description: 'login failed' })
    @UseInterceptors(TokenInterceptor)
    async login(@Body() query: LoginDto): Promise<User> {
        return await this.authService.login(query.email, query.password);
    }

    @Post('forgot-password')
    @ApiBody({ type: ForgotPasswordDto })
    @ApiOkResponse({ type: User })
    async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPassword);
    }

    @Post('reset-password')
    @ApiBody({ type: ResetPasswordDto })
    @ApiOkResponse({ type: User })
    async resetPassword(@Body() payload: ResetPasswordDto): Promise<User> {
        return this.authService.resetPassword(payload.password, payload.token);
    }
}
