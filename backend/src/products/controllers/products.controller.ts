import { ClassSerializerInterceptor, Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth('defaultToken')
@ApiTags('Product')
@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(JWTAuthGuard)
    @Get('')
    async getMyTickets() {
        return await this.productService.getAll();
    }

    @Get('/search/:name')
    async getByName(@Param('name') name: string) {
        return await this.productService.findProductByName(name);
    }
}
