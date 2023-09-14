import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// import { JWTAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { FollowUserDto } from '../dto/follow-user.dto';
import { AdminOnlyGuard } from '../../auth/guards/only-admin.guard';
import { UpdateUserByAdmin } from '../dto/update-user-by-admin.dto';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { UserDto } from '../dto/user.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('defaultToken')
@UseGuards(JWTAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch(':id')
    @UseGuards(AdminOnlyGuard)
    @ApiCreatedResponse()
    async updateOne(@Param('id') id: string, @Body() updateUserByAdmin: UpdateUserByAdmin) {
        return await this.userService.updateUserInviting(+id, updateUserByAdmin);
    }
}
