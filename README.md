# Express TypeScript API Seleksi Tenaga Ahli Diskominfo JATIM

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (v5.7 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Database Setup

1. Create a new database in MySQL:

   ```sql
   CREATE DATABASE your_database_name;
   ```

2. Create the necessary tables. You can run the following SQL commands:

   ```sql
   CREATE TABLE products (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       price DECIMAL(10, 2) NOT NULL,
       stock INT NOT NULL,
       sold INT DEFAULT 0,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   CREATE TABLE orders (
       id INT AUTO_INCREMENT PRIMARY KEY,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   CREATE TABLE order_items (
       id INT AUTO_INCREMENT PRIMARY KEY,
       order_id INT,
       product_id INT,
       quantity INT NOT NULL,
       price DECIMAL(10, 2) NOT NULL,
       FOREIGN KEY (order_id) REFERENCES orders(id),
       FOREIGN KEY (product_id) REFERENCES products(id)
   );
   ```

## Environment Variables

1. Create a `.env` file in the root of your project:

   ```env
   HOST=localhost
   USER=your_mysql_user
   PASSWORD=your_mysql_password
   DB=your_database_name
   ```

## Running the API

1. For development, use:

   ```bash
   npm run dev
   ```

   This command runs the server using `nodemon`, which automatically restarts the server on changes.

2. To build the TypeScript files, use:

   ```bash
   npm run build
   ```

3. To start the production server, use:

   ```bash
   npm start
   ```

## API Endpoints

- `GET /api/products`: Retrieve a list of all products.
- `POST /api/products`: Create a new product.
- `GET /api/products/{id}`: Retrieve details of a specific product.
- `PUT /api/products/{id}`: Update a specific product.
- `DELETE /api/products/{id}`: Delete a specific product.

- `GET /api/orders`: Retrieve a list of all orders.
- `POST /api/orders`: Create a new order.
- `GET /api/orders/{id}`: Retrieve details of a specific order.
- `DELETE /api/orders/{id}`: Delete a specific order.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.