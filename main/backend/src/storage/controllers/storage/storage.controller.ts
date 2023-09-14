import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiBearerAuth('defaultToken')
@UseGuards(JWTAuthGuard)
@Controller('storage')
export class StorageController {}
