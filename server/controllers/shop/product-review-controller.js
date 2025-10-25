const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");


const addProductReview = async (req, res) => {
    try {
        const { productId, userId, userName, reviewMessage, reviewValue } =
            req.body;

        const order = await Order.findOne({
            userId,
            "cartItems.productId": productId,
            orderStatus: { $in: ["confirmed", "delivered"] },
        });

        //if order not found
        if (!order) {
            return res.status(403).json({
                success: false,
                message: "You need to purchase product to review it.",
            });
        }

        //if review already exists
        const checkExistinfReview = await ProductReview.findOne({
            productId,
            userId,
        });


        if (checkExistinfReview) {
            return res.status(400).json({
                success: false,
                message: "You already reviewed this product!",
            });
        }

        const newReview = new ProductReview({
            productId,
            userId,
            userName,
            reviewMessage,
            reviewValue,
        });

        await newReview.save();

        const reviews = await ProductReview.find({ productId });
        const totalReviewsLength = reviews.length;
        const averageReview =
            reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
            totalReviewsLength;

        await Product.findByIdAndUpdate(productId, { averageReview });

        res.status(201).json({
            success: true,
            data: newReview,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error });
    }
}

const getProductReview = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await ProductReview.find({ productId });
        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};


module.exports = {
    addProductReview,
    getProductReview,
}
