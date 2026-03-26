#!/bin/sh
set -e

echo "Waiting for the database to be ready..."
sleep 3

echo "Applying database structure..."
npx prisma db push --accept-data-loss

echo "Seeding the database..."
npx prisma db seed

echo "Starting the application..."
node dist/src/main.js