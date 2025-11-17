import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import { IProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

/**
 * Seed con data de prueba a lazar , aun no conozco como lucen los products de contentFul
 * no me han respondido el correo con las credenciales validas
 */
const seedProducts: Partial<Product>[] = [
  {
    sku: 'LAPTOP-001',
    name: 'MacBook Pro M3',
    description: 'Laptop profesional de Apple con chip M3',
    price: 2499.99,
    currency: 'USD',
    category: 'Electronics',
    tags: ['laptop', 'apple', 'pro'],
    images: ['https://example.com/macbook.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'MOUSE-001',
    name: 'Logitech MX Master 3S',
    description: 'Mouse ergonómico inalámbrico',
    price: 99.99,
    currency: 'USD',
    category: 'Electronics',
    tags: ['mouse', 'logitech', 'wireless'],
    images: ['https://example.com/mouse.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'KEYBOARD-001',
    name: 'Keychron K2 V2',
    description: 'Teclado mecánico compacto',
    price: 79.99,
    currency: 'USD',
    category: 'Electronics',
    tags: ['keyboard', 'mechanical', 'keychron'],
    images: ['https://example.com/keyboard.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'MONITOR-001',
    name: 'Dell UltraSharp 27',
    description: 'Monitor 4K de 27 pulgadas',
    price: 499.99,
    currency: 'USD',
    category: 'Electronics',
    tags: ['monitor', 'dell', '4k'],
    images: ['https://example.com/monitor.jpg'],
    inStock: false,
    deletedAt: new Date('2024-11-15'),
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'WEBCAM-001',
    name: 'Logitech C920',
    description: 'Cámara web HD 1080p',
    price: 0,
    currency: 'USD',
    category: 'Electronics',
    tags: ['webcam', 'logitech', 'hd'],
    images: ['https://example.com/webcam.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'HEADPHONES-001',
    name: 'Sony WH-1000XM5',
    description: 'Audífonos con cancelación de ruido',
    price: 349.99,
    currency: 'USD',
    category: 'Electronics',
    tags: ['headphones', 'sony', 'wireless', 'noise-cancelling'],
    images: ['https://example.com/headphones.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'TABLET-001',
    name: 'iPad Air M2',
    description: 'Tablet de Apple con chip M2',
    price: 599.99,
    currency: 'USD',
    category: 'Electronics',
    tags: ['tablet', 'apple', 'ipad'],
    images: ['https://example.com/ipad.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'SMARTPHONE-001',
    name: 'iPhone 15 Pro',
    description: 'Smartphone de Apple con chip A17 Pro',
    price: 999.99,
    currency: 'USD',
    category: 'Electronics',
    tags: ['smartphone', 'apple', 'iphone'],
    images: ['https://example.com/iphone.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'SPEAKER-001',
    name: 'HomePod Mini',
    description: 'Altavoz inteligente compacto',
    price: 99.99,
    currency: 'USD',
    category: 'Electronics',
    tags: ['speaker', 'apple', 'smart'],
    images: ['https://example.com/homepod.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'CHARGER-001',
    name: 'Anker PowerPort III',
    description: 'Cargador USB-C de 65W',
    price: 45.99,
    currency: 'USD',
    category: 'Accessories',
    tags: ['charger', 'anker', 'usb-c'],
    images: ['https://example.com/charger.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'CABLE-001',
    name: 'Belkin USB-C Cable',
    description: 'Cable USB-C de 2 metros',
    price: 19.99,
    currency: 'USD',
    category: 'Accessories',
    tags: ['cable', 'belkin', 'usb-c'],
    images: ['https://example.com/cable.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
  {
    sku: 'CASE-001',
    name: 'Apple Leather Case',
    description: 'Funda de cuero para iPhone',
    price: 59.99,
    currency: 'USD',
    category: 'Accessories',
    tags: ['case', 'apple', 'leather'],
    images: ['https://example.com/case.jpg'],
    inStock: false,
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-16'),
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const productRepository = app.get<IProductRepository>(PRODUCT_REPOSITORY);

  try {
    console.log('📦 Inserting products...\n');

    for (const productData of seedProducts) {
      const product = new Product(productData as any);

      try {
        await productRepository.create(product);
        console.log(`✅ Created: ${product.sku} - ${product.name}`);
      } catch (error: any) {
        if (error?.code === 11000) {
          console.log(`⚠️  Skipped (already exists): ${product.sku}`);
        } else {
          console.error(`❌ Error creating ${product.sku}:`, error.message);
        }
      }
    }

    console.log('\n✅ Seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Total products: ${seedProducts.length}`);
    console.log(
      `   Active products: ${seedProducts.filter((p) => !p.deletedAt).length}`,
    );
    console.log(
      `   Deleted products: ${seedProducts.filter((p) => p.deletedAt).length}`,
    );
    console.log(
      `   Without price: ${seedProducts.filter((p) => p.price === 0).length}\n`,
    );
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
