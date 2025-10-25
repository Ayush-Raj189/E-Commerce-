const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require('dotenv').config()

// Import routes
const authRouter = require("./routes/auth/auth-routes")
const adminProductsRouter = require("./routes/admin/products-routes")
const shopProductsRouter = require("./routes/shop/products-routes")
const shopCartRouter = require("./routes/shop/cart-routes")
const shopAddressRouter = require("./routes/shop/address-route")
const shopOrderRouter = require("./routes/shop/order-routes")
const adminOrderRouter = require("./routes/admin/order-routes")
const shopSearchRouter = require("./routes/shop/search-routes")
const shopReviewRouter = require("./routes/shop/review-routes")
const commonFeatureRouter = require("./routes/common/feature-routes")

// Initialize Express FIRST
const app = express()
const port = process.env.PORT || 5000

// ✅ FIX 1: CORS MUST BE FIRST - BEFORE ALL ROUTES
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials: true
}))

// ✅ FIX 2: Handle preflight requests
app.options('*', cors())

// Body parsing middleware
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Database connected"))
    .catch((err) => console.log("❌ Database error:", err))

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'E-commerce API is running!', 
        status: 'success',
        environment: process.env.NODE_ENV 
    })
})

// API Routes
app.use("/api/auth", authRouter)
app.use("/api/admin/products", adminProductsRouter)
app.use("/api/admin/orders", adminOrderRouter)
app.use("/api/shop/products", shopProductsRouter)
app.use("/api/shop/cart", shopCartRouter)
app.use("/api/shop/address", shopAddressRouter)
app.use("/api/shop/order", shopOrderRouter)  
app.use("/api/shop/search", shopSearchRouter)
app.use("/api/shop/review", shopReviewRouter)
app.use("/api/common/feature", commonFeatureRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err)
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    })
})

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
})

// ✅ FIX 3: CRITICAL - Export for Vercel serverless
module.exports = app
