import { pgTable, uuid, varchar, numeric, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';

// 1. Transaction Type Enum ('income' or 'expense')
export const transactionTypeEnum = pgEnum('transaction_type', ['INCOME', 'EXPENSE']);

// 2. Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // Nullable for global defaults, or tied to a user
  name: varchar('name', { length: 100 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  color: varchar('color', { length: 7 }), // Hex code for UI charts (e.g. #10B981)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Transactions Table
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(), // Stores exact decimal amounts like 1250.50
  type: transactionTypeEnum('type').notNull(),
  description: text('description'),
  transactionDate: timestamp('transaction_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});