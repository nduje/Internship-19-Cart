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
      card: {
        create: {
          iban: 'HR1210010051863000160',
          expiration: '12/27',
          isct: '123',
        },
      },
    },
    include: { addresses: true, card: true },
  });

  const catFormal = await prisma.category.create({ data: { name: 'Formal' } });
  const catCasual = await prisma.category.create({ data: { name: 'Casual' } });
  const catSport = await prisma.category.create({ data: { name: 'Sport' } });
  const catStreetwear = await prisma.category.create({
    data: { name: 'Streetwear' },
  });

  const productsData = [
    {
      name: 'Black Shirt',
      price: 19.9,
      catId: catFormal.id,
      brand: 'Zara',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.BLACK],
      image: '/src/assets/images/products/black_shirt.svg',
    },
    {
      name: 'Black Pants',
      price: 29.9,
      catId: catFormal.id,
      brand: 'Sinsay',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.BLACK],
      image: '/src/assets/images/products/black_pants.svg',
    },
    {
      name: 'Formal Dress Shoes',
      price: 49.9,
      catId: catFormal.id,
      brand: 'Zara',
      sizes: [Size.EU_44, Size.EU_45, Size.EU_46],
      colors: [Color.BLACK],
      image: '/src/assets/images/products/formal_dress_shoes.svg',
    },
    {
      name: 'Blue Shirt',
      price: 29.9,
      catId: catFormal.id,
      brand: 'Bershka',
      sizes: [Size.M, Size.L, Size.XL],
      colors: [Color.BLUE, Color.GREEN],
      image: '/src/assets/images/products/blue_shirt.svg',
    },
    {
      name: 'Hoodie',
      price: 19.9,
      catId: catCasual.id,
      brand: 'Pull&Bear',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.GRAY, Color.BLACK],
      image: '/src/assets/images/products/hoodie.svg',
    },
    {
      name: 'T-Shirt',
      price: 9.9,
      catId: catCasual.id,
      brand: 'Reserved',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.BLACK],
      image: '/src/assets/images/products/tshirt.svg',
    },
    {
      name: 'Majica Dugih Rukava',
      price: 19.9,
      catId: catCasual.id,
      brand: 'Zara',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.BLACK, Color.GREEN],
      image: '/src/assets/images/products/black_sweater.svg',
    },
    {
      name: 'Sweatpants',
      price: 19.9,
      catId: catCasual.id,
      brand: 'Bershka',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.GRAY],
      image: '/src/assets/images/products/sweatpants.svg',
    },
    {
      name: 'Tiger Mexico 66',
      price: 89.9,
      catId: catStreetwear.id,
      brand: 'Onitsuka',
      sizes: [Size.EU_44, Size.EU_45, Size.EU_46],
      colors: [Color.YELLOW, Color.RED],
      image: '/src/assets/images/products/tiger_mexico_66.svg',
    },
    {
      name: 'YOYOGI 2021F - Jeans',
      price: 299.9,
      catId: catStreetwear.id,
      brand: 'Acne Studios',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.BLUE],
      image: '/src/assets/images/products/jeans.svg',
    },
    {
      name: 'Spezial',
      price: 79.9,
      catId: catStreetwear.id,
      brand: 'adidas',
      sizes: [Size.EU_44, Size.EU_45, Size.EU_46],
      colors: [Color.BLUE, Color.RED],
      image: '/src/assets/images/products/spezial.svg',
    },
    {
      name: 'Spider-Man Long Sleeve',
      price: 29.9,
      catId: catStreetwear.id,
      brand: 'Bershka',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.GRAY],
      image: '/src/assets/images/products/spiderman.svg',
    },
    {
      name: 'Regular Shorts',
      price: 20.0,
      catId: catSport.id,
      brand: 'Nike',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.GREEN, Color.RED],
      image: '/src/assets/images/products/regular_shorts.svg',
    },
    {
      name: 'Regular Jacket',
      price: 104.95,
      catId: catSport.id,
      brand: 'Nike',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.BLACK],
      image: '/src/assets/images/products/regular_jacket.svg',
    },
    {
      name: 'Regular Jacket',
      price: 50.9,
      catId: catSport.id,
      brand: 'Puma',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.BLUE],
      image: '/src/assets/images/products/regular_jacket_2.svg',
    },
    {
      name: 'Regular Pants',
      price: 80.95,
      catId: catSport.id,
      brand: 'Puma',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.GRAY],
      image: '/src/assets/images/products/regular_jacket_2.svg',
    },
    {
      name: 'Running',
      price: 59.9,
      catId: catSport.id,
      brand: 'Nike',
      sizes: [Size.EU_44, Size.EU_45, Size.EU_46],
      colors: [Color.WHITE, Color.BLUE],
      image: '/src/assets/images/products/running.svg',
    },
    {
      name: 'Sport Jersey',
      price: 59.9,
      catId: catSport.id,
      brand: 'Nike',
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      colors: [Color.YELLOW],
      image: '/src/assets/images/products/jersey.svg',
    },
  ];

  const createdProducts: Product[] = [];

  const description =
    'Stylish and comfortable clothing designed for everyday wear. Made from high-quality materials, this piece offers a versatile fit and timeless design suitable for any occasion.';

  for (const [index, p] of productsData.entries()) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: description,
        price: p.price,
        brand: p.brand,
        inStock: index === 4 ? false : true,
        image: p.image || '/src/assets/images/products/placeholder.svg',
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

  const createOrder = async (
    userId: number,
    products: typeof createdProducts,
    status: OrderStatus,
    addressId: number,
  ) => {
    await prisma.order.create({
      data: {
        userId,
        totalPrice: products.reduce((sum, p) => sum + p.price, 0),
        status,
        deliveryAddressId: addressId,
        billingAddressId: addressId,
        items: {
          create: products.map((p) => ({
            productId: p.id,
            productName: p.name,
            price: p.price,
            size: p.sizes[0],
            color: p.colors[0],
          })),
        },
      },
    });
  };

  await createOrder(
    regularUser.id,
    createdProducts.slice(0, 3),
    OrderStatus.CONFIRMED,
    regularUser.addresses[0].id,
  );

  await createOrder(
    regularUser.id,
    createdProducts.slice(5, 10),
    OrderStatus.PENDING,
    regularUser.addresses[0].id,
  );

  await prisma.favorite.createMany({
    data: [
      { userId: regularUser.id, productId: createdProducts[0].id },
      { userId: regularUser.id, productId: createdProducts[1].id },
      { userId: regularUser.id, productId: createdProducts[4].id },
    ],
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
