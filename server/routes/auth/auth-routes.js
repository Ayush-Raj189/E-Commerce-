const express = require("express")
const { registerUser } = require("../../controllers/auth/auth-controller")
const { loginUser } = require("../../controllers/auth/auth-controller")
const { authMiddleware } = require("../../controllers/auth/auth-controller")
const { logoutUser } = require("../../controllers/auth/auth-controller")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/check-auth", authMiddleware, (req, res) => {
    const user = req.user
    res.status(200).json({
        message: "Authenticated User! 🎉",
        success: true,
        user: user
    })
})

module.exports = router