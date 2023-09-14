// product-color.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './products.entity';

@Entity()
export class ProductColor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    hexCode!: string;

    @ManyToOne(() => Product, (product) => product.productColors)
    product!: Product;
}
