-- =====================================================================
-- ARTHIK - Personal Finance Management System
-- Sample Seed Data for Demonstration & Testing
-- =====================================================================

USE arthik_db;

-- Clear previous sample records if re-running (safe order for foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE savings_contributions;
TRUNCATE TABLE savings_goals;
TRUNCATE TABLE budgets;
TRUNCATE TABLE transactions;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. SEED USER
-- Default password: password123 (BCrypt hash)
INSERT INTO users (id, full_name, email, password_hash, currency) VALUES
(1, 'Akarsh', 'akarsh@arthik.com', '$2a$10$LD3ds.qJ0kBOQ1.So4gyaeTxplYiD9FlPLlihaFdPJK8d93yH0qBy', 'INR');

-- 2. SEED CATEGORIES (Standard & Custom)
-- Income Categories
INSERT INTO categories (id, name, type, icon, color, user_id) VALUES
(1, 'Salary', 'INCOME', 'Briefcase', '#10B981', NULL),
(2, 'Freelance', 'INCOME', 'Laptop', '#34D399', NULL),
(3, 'Investments', 'INCOME', 'TrendingUp', '#6EE7B7', NULL),
(4, 'Pocket Money / Allowance', 'INCOME', 'Gift', '#A7F3D0', NULL),

-- Expense Categories
(5, 'Food & Dining', 'EXPENSE', 'Utensils', '#F59E0B', NULL),
(6, 'Rent & Housing', 'EXPENSE', 'Home', '#EF4444', NULL),
(7, 'Groceries', 'EXPENSE', 'ShoppingCart', '#8B5CF6', NULL),
(8, 'Shopping', 'EXPENSE', 'ShoppingBag', '#EC4899', NULL),
(9, 'Transportation', 'EXPENSE', 'Car', '#3B82F6', NULL),
(10, 'Entertainment', 'EXPENSE', 'Film', '#6366F1', NULL),
(11, 'Utilities & Bills', 'EXPENSE', 'Zap', '#14B8A6', NULL),
(12, 'Healthcare', 'EXPENSE', 'HeartPulse', '#F43F5E', NULL),
(13, 'Education & Books', 'EXPENSE', 'BookOpen', '#84CC16', NULL);

-- 3. SEED TRANSACTIONS
-- Current month (November 2026) and previous month transactions
INSERT INTO transactions (id, user_id, category_id, title, amount, type, transaction_date, payment_method, description) VALUES
-- Incomes for November 2026
(1, 1, 1, 'Monthly Job Salary', 75000.00, 'INCOME', '2026-11-01', 'Net Banking', 'November monthly stipend / software engineer salary'),
(2, 1, 2, 'Fullstack React Project Freelance', 18500.00, 'INCOME', '2026-11-01', 'UPI', 'Payment received for client landing page and dashboard'),
(3, 1, 3, 'Mutual Fund Dividend', 2400.00, 'INCOME', '2026-11-01', 'Net Banking', 'Quarterly dividend payout'),

-- Expenses for November 2026
(4, 1, 6, 'Apartment Rent', 18000.00, 'EXPENSE', '2026-11-01', 'Net Banking', 'Shared 2BHK rent payment for November'),
(5, 1, 7, 'Monthly Supermarket Groceries', 5850.00, 'EXPENSE', '2026-11-01', 'Credit Card', 'D-Mart grocery restock: staples, vegetables, dairy'),
(6, 1, 5, 'Dinner with Friends at Olive Bistro', 3200.00, 'EXPENSE', '2026-11-01', 'UPI', 'Weekend team dinner'),
(7, 1, 8, 'Zara Autumn Jacket & Shoes', 5200.00, 'EXPENSE', '2026-11-01', 'Credit Card', 'Winter wardrobe update'),
(8, 1, 9, 'Monthly Metro Pass & Uber Rides', 2800.00, 'EXPENSE', '2026-11-01', 'UPI', 'Metro smart card recharge and cab fares'),
(9, 1, 11, 'High Speed Fiber WiFi', 1199.00, 'EXPENSE', '2026-11-01', 'UPI', 'Airtel Xstream 200 Mbps broadband bill'),
(10, 1, 10, 'IMAX Movie Tickets & Popcorn', 1350.00, 'EXPENSE', '2026-11-01', 'Debit Card', 'Interstellar IMAX re-release screening'),
(11, 1, 13, 'System Design & Algorithms Book', 1650.00, 'EXPENSE', '2026-11-01', 'UPI', 'Designing Data-Intensive Applications paperback'),
(12, 1, 12, 'Annual Dental Health Checkup', 1500.00, 'EXPENSE', '2026-11-01', 'Cash', 'Routine cleaning and checkup'),

-- October 2026 historical transactions (for monthly trend comparison)
(13, 1, 1, 'October Job Salary', 75000.00, 'INCOME', '2026-10-01', 'Net Banking', 'October salary credit'),
(14, 1, 6, 'October Apartment Rent', 18000.00, 'EXPENSE', '2026-10-02', 'Net Banking', 'October rent payment'),
(15, 1, 7, 'October Groceries', 6200.00, 'EXPENSE', '2026-10-05', 'Credit Card', 'Groceries and snacks'),
(16, 1, 5, 'Cafe Visits & Zomato', 4100.00, 'EXPENSE', '2026-10-14', 'UPI', 'Food delivery and coffees'),
(17, 1, 9, 'Fuel & Travel', 3100.00, 'EXPENSE', '2026-10-20', 'UPI', 'Fuel refills and travel'),
(18, 1, 11, 'Electricity & Utilities Bill', 2450.00, 'EXPENSE', '2026-10-22', 'Net Banking', 'October state power bill');

-- 4. SEED BUDGETS (For November 2026)
INSERT INTO budgets (id, user_id, category_id, month_year, amount_limit) VALUES
(1, 1, 5, '2026-11', 6000.00),   -- Food & Dining (Spent: 3200 -> 53.3% - Healthy)
(2, 1, 7, '2026-11', 7000.00),   -- Groceries (Spent: 5850 -> 83.5% - Exceeds 80% Warning!)
(3, 1, 8, '2026-11', 5000.00),   -- Shopping (Spent: 5200 -> 104% - Exceeded 100% Alert!)
(4, 1, 9, '2026-11', 4000.00),   -- Transportation (Spent: 2800 -> 70% - Healthy)
(5, 1, 10, '2026-11', 2500.00),  -- Entertainment (Spent: 1350 -> 54% - Healthy)
(6, 1, 11, '2026-11', 3000.00);  -- Utilities (Spent: 1199 -> 39.9% - Healthy)

-- 5. SEED SAVINGS GOALS
INSERT INTO savings_goals (id, user_id, title, target_amount, current_amount, target_date, category, status) VALUES
(1, 1, 'M3 MacBook Pro Setup', 140000.00, 65000.00, '2027-04-30', 'Tech & Work', 'IN_PROGRESS'),
(2, 1, 'Emergency Reserve Fund (6 Months)', 120000.00, 85000.00, '2027-12-31', 'Safety', 'IN_PROGRESS'),
(3, 1, 'New Year Goa Vacation', 30000.00, 24000.00, '2026-12-25', 'Travel', 'IN_PROGRESS'),
(4, 1, 'Mechanical Keyboard & Desk Ergonomics', 15000.00, 15000.00, '2026-10-15', 'Gadgets', 'COMPLETED');

-- 6. SEED SAVINGS CONTRIBUTIONS
INSERT INTO savings_contributions (id, goal_id, amount, contribution_date, notes) VALUES
(1, 1, 25000.00, '2026-09-15', 'Initial deposit from freelance savings'),
(2, 1, 20000.00, '2026-10-02', 'Transferred portion of October salary'),
(3, 1, 20000.00, '2026-11-01', 'Monthly recurring allocation'),
(4, 2, 50000.00, '2026-08-01', 'Fixed deposit maturity allocation'),
(5, 2, 20000.00, '2026-09-30', 'Emergency reserve top-up'),
(6, 2, 15000.00, '2026-10-31', 'Festival bonus transfer'),
(7, 3, 12000.00, '2026-10-10', 'Trip deposit 1'),
(8, 3, 12000.00, '2026-11-01', 'Flight ticket fund allocation'),
(9, 4, 15000.00, '2026-10-12', 'Full contribution towards custom keyboard');
