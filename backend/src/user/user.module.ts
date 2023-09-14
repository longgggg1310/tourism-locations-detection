import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { BullModule } from '@nestjs/bull';
import { ProfileController } from './controllers/profile.controller';
import { Profile } from './entities/profile.entity';
import { IsEmailAvailable } from './constraints/is-email-available.validator';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
        BullModule.registerQueueAsync(
            {
                name: 'send-email',
            },
            {
                name: 'user-default-setting',
            },
        ),
    ],
    controllers: [ProfileController, UserController],
    providers: [UserService, IsEmailAvailable],
    exports: [UserService],
})
export class UserModule {}
