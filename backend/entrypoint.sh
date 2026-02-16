#!/bin/sh
set -e

echo "====================================="
echo "Starting container initialization..."
echo "====================================="

echo "Running database migrations..."
if npm run db:migrate; then
    echo "✓ Migrations completed successfully"
else
    echo "✗ Migration failed!"
    exit 1
fi

echo "Seeding database..."
if npm run db:seed; then
    echo "✓ Seeding completed successfully"
else
    echo "✗ Seeding failed!"
    exit 1
fi
