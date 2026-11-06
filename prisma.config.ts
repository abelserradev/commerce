import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  'postgresql://ci:ci@127.0.0.1:5432/commerce_ci';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  datasource: {
    url: databaseUrl,
  },
});
