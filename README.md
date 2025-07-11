# LUXE - Premium E-Commerce Platform

A comprehensive luxury e-commerce platform built with Next.js and Node.js, featuring premium UI/UX design, real-time chat support, automated image processing, and a powerful admin panel.

## 🌟 Features

### Frontend (Next.js)
- **Premium UI/UX**: Luxury-themed design with gold accents and smooth animations
- **Responsive Design**: Optimized for all devices and screen sizes
- **Product Catalog**: Advanced filtering, search, and category browsing
- **Shopping Cart**: Real-time cart updates with smooth animations
- **User Authentication**: Secure login/register with JWT tokens
- **Real-time Chat**: Customer support with Socket.io integration
- **Wishlist**: Save favorite products for later
- **Order Tracking**: Track order status and shipping information

### Backend (Node.js + Express)
- **RESTful API**: Comprehensive API with proper error handling
- **Real-time Features**: Socket.io for chat and live updates
- **Image Processing**: Automated background removal and optimization
- **Security**: Rate limiting, helmet, CORS, and authentication
- **Database**: MongoDB with Mongoose ODM
- **File Uploads**: Multer with Sharp for image processing

### Admin Panel
- **Product Management**: Add, edit, and remove products with bulk operations
- **Order Management**: View, update, and track customer orders
- **Customer Support**: Manage chat conversations and respond to customers
- **Analytics Dashboard**: Sales metrics, customer insights, and performance data
- **Theme Customization**: Dynamic color scheme and design changes
- **User Management**: Customer accounts and role-based access control

### Automated Image Processing
- **Background Removal**: Automatic background removal for product images
- **Image Optimization**: Resize, compress, and format conversion
- **Multiple Formats**: Support for WebP, AVIF, and fallback formats
- **CDN Ready**: Optimized for content delivery networks

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- MongoDB 4.4 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxury-ecommerce-platform
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install all dependencies (client + server)
   npm run install:all
   ```

3. **Environment Configuration**
   
   Create `.env` file in the server directory:
   ```bash
   # Database
   MONGODB_URI=mongodb://localhost:27017/luxury-ecommerce

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000

   # Image Processing
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret

   # Email Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # Payment Gateway (Optional)
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

   # API Keys
   API_KEY=your-internal-api-key
   ```

   Create `.env.local` file in the client directory:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod

   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Start the application**
   ```bash
   # Development mode (runs both client and server)
   npm run dev

   # Or start individually
   npm run dev:client  # Starts Next.js on port 3000
   npm run dev:server  # Starts Express on port 5000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 📁 Project Structure

```
luxury-ecommerce-platform/
├── client/                     # Next.js Frontend
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Layout components
│   │   ├── product/          # Product-related components
│   │   ├── admin/            # Admin panel components
│   │   └── chat/             # Chat components
│   ├── pages/                # Next.js pages
│   ├── store/                # Zustand state management
│   ├── styles/               # CSS and styling
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── server/                    # Node.js Backend
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API route handlers
│   ├── middleware/           # Custom middleware
│   ├── controllers/          # Business logic
│   ├── utils/                # Helper functions
│   ├── sockets/              # Socket.io handlers
│   └── uploads/              # File upload storage
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/tree` - Get category tree
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)

### Chat
- `GET /api/chat` - Get user chats
- `POST /api/chat` - Create new chat
- `POST /api/chat/:id/message` - Send message
- `GET /api/chat/admin` - Get admin chat list (admin)

### Admin
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/customers` - Get customer list
- `PUT /api/admin/themes` - Update site theme

## 🎨 Customization

### Theme Colors
The platform supports dynamic theme customization through the admin panel. Default luxury theme includes:

- **Primary Gold**: #D4AF37
- **Dark Gold**: #B8860B
- **Platinum**: #E5E4E2
- **Charcoal**: #36454F
- **Pearl**: #F8F6F0

### Adding New Product Categories
1. Use the admin panel to create categories
2. Categories support hierarchical structure (up to 3 levels)
3. Each category can have custom filters and attributes

### Custom Image Processing
Modify the image processing pipeline in `server/utils/imageProcessor.js`:
- Background removal settings
- Compression quality
- Output formats
- Watermark overlay

## 🚀 Deployment

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Set production environment**
   ```bash
   export NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   cd server
   npm start
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t luxury-ecommerce .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Cloud Deployment (Vercel + Heroku)

1. **Deploy frontend to Vercel**
   ```bash
   cd client
   vercel --prod
   ```

2. **Deploy backend to Heroku**
   ```bash
   cd server
   heroku create your-app-name
   git push heroku main
   ```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse and brute force attacks
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Cross-origin request security
- **Helmet.js**: Security headers and protections
- **Password Hashing**: bcrypt with salt rounds
- **Account Locking**: Automatic lockout after failed attempts

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test

# Run E2E tests
npm run test:e2e
```

## 📈 Performance Optimization

- **Image Optimization**: Automatic WebP/AVIF conversion
- **Code Splitting**: Dynamic imports and lazy loading
- **Caching**: Redis caching for API responses
- **CDN Integration**: Cloudinary for image delivery
- **Database Indexing**: Optimized MongoDB queries
- **Compression**: Gzip compression for responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@luxe-platform.com
- Documentation: [docs.luxe-platform.com](https://docs.luxe-platform.com)

## 🙏 Acknowledgments

- Design inspiration from luxury brand websites
- Icons by [Feather Icons](https://feathericons.com/)
- Images from [Unsplash](https://unsplash.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

**Built with ❤️ for luxury e-commerce experiences**