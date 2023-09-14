// products.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductColor } from './ProductColor.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    supplier!: string;

    @Column()
    price!: string;

    @Column()
    imageUrl!: string;

    @Column()
    description!: string;

    @Column()
    product_location!: string;

    @OneToMany(() => ProductColor, (color) => color.product, { cascade: true })
    productColors!: ProductColor[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
