import { Injectable, Logger } from '@nestjs/common';
import { Product } from '../entities/products.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) // Make sure the decorator is applied here
        private readonly productRepository: Repository<Product>,
    ) {}
    logger = new Logger(ProductService.name);
    async getAll() {
        this.logger.log(`get list of View`);
        return await this.productRepository.find();
    }

    async findProductByName(name: string): Promise<Product[]> {
        const products = await this.productRepository.find({
            where: {
                title: ILike(`%${name}%`),
            },
        });

        return products;
    }
}
