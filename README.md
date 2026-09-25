# Phone Sales Management System

A simple web application for managing phone sales, products, customer orders, invoices, and sales reports.


## Tech Stack

**Frontend**
- HTML
- CSS
- Vanilla JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MySQL

**Architecture**
- Modular Monolith
- Layered Architecture
- REST API

## Main Features

### Customer
- View product list and product details
- Search products by name
- Filter products by price
- Add products to cart
- Update/remove cart items
- Place orders

### Sales Staff
- Add, update and remove products
- View customer orders
- Confirm orders
- Cancel orders
- Complete orders
- View and print invoices
- Search invoices by date
- View sales reports

## Installation & Run

### 1. Clone the repository

```bash
git clone https://github.com/ltd9605/psm-system
cd psm-system
```

### 2. Create the database

Create a MySQL database:

```sql
CREATE DATABASE <your-db-name>;
```

Import the database schema:

```bash
mysql -u root -p <your-db-name> < database/schema.sql
```

### 3. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

### 4. Run the backend

Development mode:

```bash
npm run dev
```

Or:

```bash
npm start
```

The API will run at:

```text
http://localhost:3000
```
You can check whether the server is running via the API :

```text
http://localhost:3000/api/health
```
### 5. Run the frontend

Open the frontend HTML files directly in the browser or use a local development server such as VS Code Live Server.

```text
frontend/
```
