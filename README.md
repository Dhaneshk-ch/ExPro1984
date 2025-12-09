# E-Commerce Web Application

A complete full-stack E-Commerce web application built with React, Node.js, Express, and MongoDB.

## 🎯 Project Overview

This is a production-ready E-Commerce platform with:
- **Admin Panel**: Product management, order tracking, customer management
- **Customer Portal**: Shopping, cart, checkout, payment, order history
- **Secure Authentication**: JWT-based auth for admin and customers
- **Payment Integration**: Razorpay test mode (placeholder for production)
- **Responsive Design**: Mobile-friendly with TailwindCSS

## 📋 Features

### Admin Features
- ✅ Admin login with JWT authentication
- ✅ Dashboard with statistics (products, orders, customers, revenue)
- ✅ Add/Edit/Delete products with image uploads
- ✅ View all customers
- ✅ View and manage orders (update status)
- ✅ Product inventory management

### Customer Features
- ✅ User registration and login
- ✅ Browse products with filtering (category, price, search)
- ✅ Product detail page with reviews
- ✅ Add to cart / Remove from cart
- ✅ Checkout with shipping address
- ✅ Payment integration (Razorpay test mode)
- ✅ Order history and tracking
- ✅ Profile management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
e-commers/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── jwt.js                # JWT utilities
│   │   └── multer.js             # File upload config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── scripts/
│   │   └── seedProducts.js       # Demo data seeder
│   ├── uploads/                  # Product images
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   ├── ProductCard.js
    │   │   ├── ProtectedRoute.js
    │   │   └── AdminNavbar.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── customer/
    │   │   │   ├── Home.js
    │   │   │   ├── Products.js
    │   │   │   ├── ProductDetail.js
    │   │   │   ├── Cart.js
    │   │   │   ├── Checkout.js
    │   │   │   ├── Orders.js
    │   │   │   └── Profile.js
    │   │   └── admin/
    │   │       ├── Dashboard.js
    │   │       ├── Products.js
    │   │       ├── AddProduct.js
    │   │       └── Orders.js
    │   ├── utils/
    │   │   └── apiClient.js       # Axios instance
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── public/
    │   └── index.html
    ├── .env.example
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_super_secret_key_here
   PORT=5000
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   FRONTEND_URL=http://localhost:3000
   ```

5. **Seed database with sample data (optional)**
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   REACT_APP_RAZORPAY_KEY=rzp_test_xxxxxxxxx
   ```

5. **Start the frontend development server**
   ```bash
   npm start
   ```

   Frontend will run on `http://localhost:3000`

## 📚 API Routes

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `GET /api/auth/users` - Get all users (admin only)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/categories` - Get categories
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `POST /api/cart/add` - Add to cart (protected)
- `GET /api/cart` - Get user cart (protected)
- `PUT /api/cart/update` - Update quantity (protected)
- `POST /api/cart/remove` - Remove item (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders/create` - Create order (protected)
- `GET /api/orders/my` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `POST /api/orders/:id/cancel` - Cancel order (protected)

### Payments
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `POST /api/payment/failure` - Record payment failure
- `GET /api/payment/:orderId` - Get payment details

## 👥 Demo Users

### Admin Account
- **Email**: `admin@test.com`
- **Password**: `password123`
- **Role**: Admin

### Customer Account
- **Email**: `customer@test.com`
- **Password**: `password123`
- **Role**: Customer

> ⚠️ Note: Create these users manually or use the seed script

## 🔑 Key Endpoints Usage

### Register a Customer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products with Filters
```bash
curl "http://localhost:5000/api/products?category=Electronics&minPrice=1000&maxPrice=5000&search=headphones"
```

### Add Product (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Product Name" \
  -F "description=Product Description" \
  -F "price=1999" \
  -F "category=Electronics" \
  -F "stock=50" \
  -F "image=@path/to/image.jpg"
```

## 🛒 Shopping Flow

1. **Browse Products**
   - Visit home page
   - Filter by category/price/search
   - View product details

2. **Add to Cart**
   - Click "Add to Cart" on product
   - Update quantity in cart
   - View cart summary

3. **Checkout**
   - Enter shipping address
   - Select payment method
   - Review order summary

4. **Payment**
   - Process via Razorpay (test mode)
   - Or select Cash on Delivery

5. **Order Confirmation**
   - View order in My Orders
   - Track order status
   - Download invoice (future feature)

## 📊 Admin Dashboard

### Features
- Real-time statistics
- Recent orders
- Product management
- Order status updates
- Customer management

## 🔐 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcryptjs)
- ✅ Protected routes (frontend & backend)
- ✅ Role-based access control
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling

## 🚨 Important Notes

1. **MongoDB Setup**
   - Ensure MongoDB is running
   - Update `MONGODB_URI` in `.env`

2. **Razorpay Integration**
   - Use test mode keys
   - Payment verification is mocked for demo
   - Implement real verification in production

3. **File Uploads**
   - Images stored in `backend/uploads/`
   - Max file size: 5MB
   - Allowed: JPG, PNG, GIF, WebP

4. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` as template
   - Update secrets in production

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running or update `MONGODB_URI`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill process on port 5000

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure `FRONTEND_URL` matches frontend URL in backend `.env`

### Image Upload Not Working
```
Error: MULTER - Only image files are allowed
```
**Solution**: Ensure file is valid image format and < 5MB

## 📝 Future Enhancements

- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Real Razorpay integration
- [ ] Order invoice PDF
- [ ] User ratings and reviews
- [ ] Product recommendations
- [ ] Discount codes/coupons
- [ ] Admin analytics dashboard
- [ ] Mobile app (React Native)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console errors
3. Check backend logs

## 📄 License

MIT License - feel free to use for learning and commercial projects

---

**Happy Shopping! 🛍️**
# ExPro1984
