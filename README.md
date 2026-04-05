# Cart Application (API & Frontend)

### DUMP Internship - NestJS #3

## Task

**Cart App** is a full stack e-commerce application built using NestJS + Prisma + PostgreSQL for the backend, along with a mobile user interface and an admin dashboard for content management.

The application allows users to browse products, search and filter, manage favorites, place orders, and maintain user profiles, while the admin dashboard is used for managing products, categories, and orders.

## Features

**Backend Architecture**

- Modular NestJS structure (module, controller, service per resource)
- Prisma ORM with PostgreSQL
- DTO validation and request validation
- JWT authentication and role-based authorization
- Swagger API documentation

**Additional Features**

- Filtering, sorting, and search via query parameters
- Pagination using `page` and `limit`
- Rate limiting on authentication routes
- Global response formatting and error handling
- Secure configuration using environment variables

### API Endpoints

Swagger documentation is available at http://localhost:3000/api

**Products**

- `GET /products` - list products with filters (search, category, sort, inStock)
- `GET /products/:id` - product details
- `POST /products` - create product (admin only)
- `PUT /products/:id` - update product (admin only)
- `DELETE /products/:id` - delete product (admin only)

**Categories**

- `GET /categories` - get all categories
- `POST /categories` - create category (admin only)
- `DELETE /categories/:id` - delete category (admin only)

**Auth**

- `POST /auth/register` - user registration
- `POST /auth/login` - login (returns JWT)

**Orders**

- `GET /orders/my` - current user orders
- `POST /orders` - create new order
- `GET /orders` - all orders (admin only)
- `PATCH /orders/:id/status` - update order status (admin only)

**Favorites**

- `GET /favorites` - user favorites
- `POST /favorites/:productId` - add to favorites
- `DELETE /favorites/:productId` - remove from favorites

**Users**

- `GET /users/me` - current user profile
- `PUT /users/me` - update profile and address

## Frontend (Mobile App)

The mobile application follows the provided [Figma design](https://www.figma.com/design/0mTUxGB1cH2RkjbLcz6TTk/Usability-testing---Cart?node-id=334-1925&t=X9ln0lVGms7oNFyA-1) and includes the following screens:

**Welcome Screen**  
 Initial splash screen with logo and simple animation or fade-in effect.

**Home**  
 Displays a list of products organized by categories. Includes filter tabs and a product grid with cards.

**Search**  
 Allows users to search products with additional filters. Results are displayed in a grid layout.

**Favorites**  
 Shows all saved products. Includes empty state when no favorites exist.

**Profile**  
 Displays user information, shipping address, and payment method.

**Cart**  
 Overview of selected products with total price and a clear call-to-action for checkout.

**Checkout**  
 Form for entering shipping and billing details, along with order confirmation.

**Error & Empty States**  
 Handles loading failures, empty results, and retry actions with proper UI feedback.

## Admin Dashboard

The admin dashboard is focused on functionality and optimized for desktop use. It is accessible only to users with admin privileges.

**Product Management**

- Table view of all products with search and filters
- Create product form (name, description, price, brand, category, sizes, colors, availability)
- Image upload support
- Edit existing products
- Delete products with confirmation

**Category Management**

- View all categories
- Create new category
- Delete category (with warning if linked to products)

**Order Management**

- Table of all orders with status filtering (PENDING, CONFIRMED, SHIPPED, DELIVERED)
- Detailed order view (items, user, shipping address, total price)
- Update order status

## Database Preview

You can explore the database structure and data using Prisma Studio with the following command:

`npx prisma studio --url postgresql://postgres:postgres@localhost:5433/cart`

![preview](./docs/assets/images/preview.png)

## Test Users

The following users are pre-created for testing authentication and authorization:

| Role  | Email           | Password    |
| ----- | --------------- | ----------- |
| USER  | user@user.com   | password123 |
| ADMIN | admin@admin.com | password123 |

**USER** can browse products, manage favorites, create orders, and manage their addresses
**ADMIN** has full access to products and categories, and can view and manage all orders

## Setup

1. Clone the repository (`git clone https://github.com/nduje/Internship-19-Cart.git˙`)

### Backend Setup

2. Navigate to the backend folder (`cd backend`)
3. Install dependencies (`npm install`)
4. Generate Prisma client (`npx prisma generate`)
5. Build and start all services (`docker compose up -d --build`)

### Frontend Setup

6. Navigate to the frontend folder (`cd frontend`)
7. Install frontend dependencies (`npm install`)
8. Run the frontend application (`npm run dev`)
