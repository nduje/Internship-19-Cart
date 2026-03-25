#!/bin/sh
set -e

echo "Waiting for the database to be ready..."
sleep 3

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting the application..."
node dist/src/main.js