/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication operations
 *   - name: Brands
 *     description: Brand management
 *   - name: Customers
 *     description: Customer operations
 *   - name: Employees
 *     description: Employee management
 *   - name: Invoices
 *     description: Invoice operations
 *   - name: Orders
 *     description: Order operations
 *   - name: Products
 *     description: Product management
 * 
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               username: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *     responses:
 *       201: { description: Created }
 * 
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Customer login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/auth/employee-login:
 *   post:
 *     tags: [Auth]
 *     summary: Employee login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/brands:
 *   get:
 *     tags: [Brands]
 *     summary: Get all brands
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Brands]
 *     summary: Create a brand
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Created }
 * 
 * /api/brands/{id}:
 *   get:
 *     tags: [Brands]
 *     summary: Get brand by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   put:
 *     tags: [Brands]
 *     summary: Update brand
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Success }
 *   delete:
 *     tags: [Brands]
 *     summary: Delete brand
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/customers:
 *   get:
 *     tags: [Customers]
 *     summary: Get all customers
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Customers]
 *     summary: Create customer manually
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: Created }
 * 
 * /api/customers/{id}:
 *   get:
 *     tags: [Customers]
 *     summary: Get customer by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   put:
 *     tags: [Customers]
 *     summary: Update customer
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               phone: { type: string }
 *     responses:
 *       200: { description: Success }
 *   delete:
 *     tags: [Customers]
 *     summary: Delete customer
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/customers/{id}/cart:
 *   get:
 *     tags: [Customers]
 *     summary: Get customer cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Customers]
 *     summary: Add product to cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: integer }
 *               quantity: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/customers/{id}/cart/{productId}:
 *   put:
 *     tags: [Customers]
 *     summary: Update cart item quantity
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   delete:
 *     tags: [Customers]
 *     summary: Remove item from cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/customers/{id}/checkout:
 *   post:
 *     tags: [Customers]
 *     summary: Checkout cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipping_address: { type: string }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/customers/{id}/orders:
 *   get:
 *     tags: [Customers]
 *     summary: Get customer orders
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/customers/{id}/orders/{orderId}:
 *   get:
 *     tags: [Customers]
 *     summary: Get specific order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/customers/{id}/orders/{orderId}/cancel:
 *   put:
 *     tags: [Customers]
 *     summary: Cancel pending order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/employees:
 *   get:
 *     tags: [Employees]
 *     summary: Get all employees
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Employees]
 *     summary: Create employee
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               username: { type: string }
 *               password: { type: string }
 *               role_id: { type: integer }
 *     responses:
 *       201: { description: Created }
 * 
 * /api/employees/{id}:
 *   get:
 *     tags: [Employees]
 *     summary: Get employee by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   put:
 *     tags: [Employees]
 *     summary: Update employee
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Success }
 *   delete:
 *     tags: [Employees]
 *     summary: Soft delete employee
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/invoices:
 *   get:
 *     tags: [Invoices]
 *     summary: Get all invoices
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Invoices]
 *     summary: Create invoice manually
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id: { type: integer }
 *               employee_id: { type: integer }
 *               total_amount: { type: number }
 *     responses:
 *       201: { description: Created }
 * 
 * /api/invoices/{id}:
 *   get:
 *     tags: [Invoices]
 *     summary: Get invoice by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   put:
 *     tags: [Invoices]
 *     summary: Update invoice
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   delete:
 *     tags: [Invoices]
 *     summary: Delete invoice
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Orders]
 *     summary: Create order manually
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created }
 * 
 * /api/orders/stats:
 *   get:
 *     tags: [Orders]
 *     summary: Get order statistics
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 * 
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   put:
 *     tags: [Orders]
 *     summary: Update order general info
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   delete:
 *     tags: [Orders]
 *     summary: Delete order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/orders/{id}/approve:
 *   put:
 *     tags: [Orders]
 *     summary: Approve an order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/orders/{id}/complete:
 *   put:
 *     tags: [Orders]
 *     summary: Complete an order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/orders/{id}/cancel:
 *   put:
 *     tags: [Orders]
 *     summary: Cancel an order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 * 
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Products]
 *     summary: Create product
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               brand_id: { type: integer }
 *               quantity: { type: integer }
 *     responses:
 *       201: { description: Created }
 * 
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   put:
 *     tags: [Products]
 *     summary: Update product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *   delete:
 *     tags: [Products]
 *     summary: Delete product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 */
