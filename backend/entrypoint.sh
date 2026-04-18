#!/bin/sh
set -e

echo "Waiting for the database to be ready..."
until nc -z cart.cfqggi6w8c17.eu-central-1.rds.amazonaws.com 5432; do
  sleep 1
done

echo "Applying database structure..."
npx prisma db push --accept-data-loss

echo "Seeding the database..."
npx prisma db seed

echo "Starting the application..."
exec node dist/src/main.js