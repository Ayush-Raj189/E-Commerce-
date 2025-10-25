const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require('dotenv').config() // ✅ ADD THIS LINE

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

// ✅ UPDATED: Use environment variable for MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err))

const app = express()
const port = process.env.PORT || 5000;


// ✅ UPDATED: CORS for both local and production
app.use(
    cors({
        origin: process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL
            : 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'cache-control',
            'Expires',
            'Last-Modified',
            'Pragma'
        ],
        credentials: true
    })
)

app.use(cookieParser())
app.use(express.json())

// ✅ ADD: Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running...', 
        status: 'success',
        environment: process.env.NODE_ENV 
    })
})



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

app.listen(port, () => console.log(`Server running on port ${port} and http://localhost:${port}`))