# 🇦🇿 Discover Azerbaijan Backend

A NestJS-based backend application powered by Prisma ORM and PostgreSQL, providing the API infrastructure for the Discover Azerbaijan platform.

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Containerization:** [Docker](https://www.docker.com/)

---

## 📋 Prerequisites

Before running the application, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Docker](https://www.docker.com/products/docker-desktop/) (highly recommended for running the database)

---

## 🚀 Getting Started

### 1. Install Dependencies

Clone the repository and install the project dependencies:

```bash
npm install
```

### 2. Configure Environment Variables

Create or update the `.env` file in the root directory. You can use the following default local database configuration:

```env
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/postgres
```

---

## 🗄️ Running the Database

We provide a pre-configured `docker-compose.yml` file to spin up a PostgreSQL instance instantly.

### Option A: Running with Docker (Recommended)

1. **Start the database container:**
   ```bash
   docker compose up -d
   ```
   This will download the PostgreSQL image (if not already downloaded) and start a container named `discover-azerbaijan-db` running in the background.

2. **Stop the database container:**
   ```bash
   docker compose down
   ```

### Option B: Running without Docker (Local PostgreSQL Installation)

If you prefer to run PostgreSQL directly on your local machine:
1. Ensure PostgreSQL is installed and running on port `5432`.
2. Create a database (e.g., named `postgres`).
3. Update the `DATABASE_URL` in your `.env` file with your custom database username, password, and port:
   ```env
   DATABASE_URL=postgresql://<YOUR_USERNAME>:<YOUR_PASSWORD>@localhost:5432/<YOUR_DB_NAME>
   ```

---

## 🔄 Database Setup & Migrations (Prisma)

Once your database is up and running, you need to apply the database schema and generate the client:

### 1. Apply Schema / Create Migrations
To sync your Prisma schema with the database and create a migration:
```bash
npx prisma migrate dev --name init
```
*Note: If you just want to push the schema directly to the database without tracking migrations (suitable for quick local prototyping), run:*
```bash
npx prisma db push
```

### 2. Generate Prisma Client
To generate the Prisma Client code so TypeScript can query the database with full autocomplete support:
```bash
npx prisma generate
```

---

## 🔍 Inspecting the Database

Here are the ways you can inspect your database tables, schemas, and data:

### Option 1: Using Prisma Studio (Recommended GUI)
Prisma provides a built-in visual database browser:
```bash
npx prisma studio
```
This opens a local web application at [http://localhost:5555](http://localhost:5555) where you can easily read, search, create, update, and delete database records.

### Option 2: Logging into the Docker Container (CLI via psql)
If you are running the database using Docker, you can connect directly to PostgreSQL inside the container using the command line:

1. **Log in to the database shell inside the container:**
   ```bash
   docker exec -it my-postgres psql -U postgres -d postgres
   ```
   *(Note: replace `-d postgres` with `-d <YOUR_DB_NAME>` if your database name differs in `.env`)*

2. **Useful `psql` Commands inside the shell:**
   - **List all tables:**
     ```sql
     \dt
     ```
   - **Describe a table's schema (e.g., the `User` table):**
     ```sql
     \d "User"
     ```
     *(Note: quotes are required around table names as Prisma uses casing for model names)*
   - **Query table records:**
     ```sql
     SELECT * FROM "User";
     ```
   - **Exit the `psql` shell:**
     ```sql
     \q
     ```

---

## 💻 Running the Application

### Development Mode
Runs the application with hot-reloading enabled, meaning it automatically restarts when files change:
```bash
npm run start:dev
```

### Production Mode
Builds the production bundle and runs the compiled JavaScript:
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end (e2e) tests
npm run test:e2e

# Test coverage
npm run test:cov
```
