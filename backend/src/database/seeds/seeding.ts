// src/seeding.ts

import { ProductColor } from 'src/products/entities/ProductColor.entity';
import { Product } from 'src/products/entities/products.entity';
import { createConnection, getRepository } from 'typeorm';
async function seedDatabase() {
    try {
        // Create a database connection
        const connection = await createConnection();

        // Create instances of ProductColor
        const productColorsData = [
            { title: '0001', hexCode: '#FF5722' },
            { title: '0002', hexCode: '#2196F3' },
            { title: '0003', hexCode: '#FFC107' },
            { title: '0004', hexCode: '#F5F5F5' },
            { title: '0005', hexCode: '#212121' },
        ];

        const productColorRepository = getRepository(ProductColor); // Create a repository for ProductColor
        const productColors = productColorsData.map((data) => productColorRepository.create(data));

        // Create instances of Product
        const productData = [
            {
                title: 'Product 1',
                supplier: 'Supplier 1',
                price: '19.99',
                imageUrl: 'https://example.com/product1.jpg',
                description: 'Description of Product 1',
                product_location: 'Location 1',
                productColors: [productColors[0], productColors[1]],
            },
            {
                title: 'Product 2',
                supplier: 'Supplier 2',
                price: '29.99',
                imageUrl: 'https://example.com/product2.jpg',
                description: 'Description of Product 2',
                product_location: 'Location 2',
                productColors: [productColors[2]],
            },
            // Add more products here
        ];

        const productRepository = getRepository(Product); // Create a repository for Product
        const products = productData.map((data) => productRepository.create(data));

        // Save the entities to the database
        await productColorRepository.save(productColors);
        await productRepository.save(products);

        // Close the database connection
        await connection.close();

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding the database:', error);
    }
}

seedDatabase().then(() => process.exit());
