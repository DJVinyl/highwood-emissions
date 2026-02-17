# Highwood Engineering Challenge: Emissions Data Platform

## A letter from the author

Hello Highwood Emissions

Thank you for the challenge. I had a lot of fun and enjoyed the challenge. This is my submission to your take-home assignment. I hope you enjoy my take on the assignment and hope to hear from you soon.
-Mitchell

# Overview

This project is a real-time Emissions Ingestion and Analytics Engine. It has a high focus on data consistency, non-negotiable data integrity, despite unstable network conditions. It is a monorepo setup and coded entirely in Typescript allow other engineers read and develop easily upon.

# Technology Stack

- Backend: NodeJS using Fastify framework
- Frontend: NextJS App router
- Database: PostgreSQL
- ~~Cache: Redis is optional (provided in the docker-compose).~~
- Tools: Drizzle ORM, and Zod for data validation.

# Architecture

Please refer to **Architecture.md** for more information on the system, what decisions were made, and what tasks were completed.

# Getting Started (Local development)

1. Run the install script

```bash
./install
```

This install script will set up the docker environment for the frontend, backend, database with seed data.

Once the environment is running:

```
Frontend: http://localhost:3000"
Backend: http://localhost:4000"
```

Enjoy!

2. Optional: Once you've enjoyed the platform

```bash
./reinstall
```

to enjoy it again.

3. Once your done for real:

```bash
./uninstall
```
