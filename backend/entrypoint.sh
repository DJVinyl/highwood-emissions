#!/bin/sh
set -e

echo "====================================="
echo "Starting container initialization"
echo "====================================="

FLAG_FILE="/tmp/.db-initialized"

if [ ! -f "$FLAG_FILE" ]; then
    echo "First startup detected - running db setup"

    echo "Running database migrations..."
    if npm run db:migrate; then
        echo "Migrations completed successfully"
    else
        echo "Migration failed!"
        exit 1
    fi

    echo "Seeding database..."
    if npm run db:seed; then
        echo "Seeding completed successfully"
    else
        echo "Seeding failed!"
        exit 1
    fi

    touch "$FLAG_FILE"
    echo "Database initialization complete"
else
    echo "database already initialized - skipping migrations and seeding"
fi

echo "====================================="
echo "Starting application server"
echo "====================================="

exec npm run start:production