import { PrismaPg } from '@prisma/adapter-pg';
import {
  AddressType,
  Color,
  OrderStatus,
  PrismaClient,
  Product,
  Size,
} from '@prisma/client';

import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Duje Nikolić Malora',
      email: 'user@user.com',
      password: hashedPassword,
      isAdmin: false,
      addresses: {
        create: [
          {
            type: AddressType.DELIVERY,
            street: 'Pujanke 53',
            city: 'Split',
            postalCode: '21000',
            country: 'Croatia',
          },
          {
            type: AddressType.BILLING,
            street: 'Pujanke 53',
            city: 'Split',
            postalCode: '21000',
            country: 'Croatia',
          },
        ],
      },
    },
    include: { addresses: true },
  });

  const catFormal = await prisma.category.create({ data: { name: 'Formal' } });
  const catCasual = await prisma.category.create({ data: { name: 'Casual' } });
  const catSport = await prisma.category.create({ data: { name: 'Sport' } });

  const productsData = [
    {
      name: 'Classic Black Suit',
      price: 300.0,
      catId: catFormal.id,
      brand: 'Hugo Boss',
      sizes: [Size.M, Size.L, Size.XL],
      colors: [Color.BLACK],
    },
    {
      name: 'Slim Fit Shirt',
      price: 50.0,
      catId: catFormal.id,
      brand: 'Zara',
      sizes: [Size.S, Size.M, Size.L],
      colors: [Color.WHITE, Color.BLUE],
    },
    {
      name: 'Straight Fit Jeans',
      price: 80.0,
      catId: catCasual.id,
      brand: "Levi's",
      sizes: [Size.M, Size.L, Size.XL],
      colors: [Color.BLUE, Color.BLACK],
    },
    {
      name: 'Oversized Hoodie',
      price: 45.0,
      catId: catCasual.id,
      brand: 'H&M',
      sizes: [Size.M, Size.L, Size.XL],
      colors: [Color.GRAY, Color.BLACK],
    },
    {
      name: 'Running Sneakers',
      price: 120.0,
      catId: catSport.id,
      brand: 'Nike',
      sizes: [Size.EU_42, Size.EU_43, Size.EU_44, Size.EU_45],
      colors: [Color.WHITE, Color.BLACK],
    },
  ];

  const createdProducts: Product[] = [];

  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: `Opis za ${p.name}`,
        price: p.price,
        brand: p.brand,
        image: null,
        categoryId: p.catId,
        sizes: {
          set: p.sizes,
        },
        colors: {
          set: p.colors,
        },
      },
    });

    createdProducts.push(product);
  }

  const orderProducts = [
    createdProducts[0],
    createdProducts[1],
    createdProducts[2],
  ];

  await prisma.order.create({
    data: {
      userId: regularUser.id,
      totalPrice: orderProducts.reduce((sum, p) => sum + p.price, 0),
      status: OrderStatus.CONFIRMED,
      deliveryAddressId: regularUser.addresses[0].id,
      billingAddressId: regularUser.addresses[0].id,
      items: {
        create: orderProducts.map((p) => ({
          productId: p.id,
          price: p.price,
          size: p.sizes[0],
          color: p.colors[0],
        })),
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
