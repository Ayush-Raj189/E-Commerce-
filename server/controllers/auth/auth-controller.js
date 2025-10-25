const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../../models/User")

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email })
    if (checkUser) {
      return res.status(400).json({
        message: "User already exists with this email🚨",
        success: false,
        error: true,
      })
    }
    const hashPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      userName,
      email,
      password: hashPassword
    })

    await newUser.save()
    res.status(200).json({
      message: "User registered successfully 🎉",
      success: true,
      data: newUser
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong 🚨",
      success: false,
      error: true,
    })
  }
}

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email })
    if (!checkUser) {
      return res.status(400).json({
        message: "User does not exist🚨",
        success: false,
        error: true,
      })
    }
    const isPasswordMatched = await bcrypt.compare(password, checkUser.password)
    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Incorrect password🚨",
        success: false,
        error: true,
      })
    }

    // ✅ Create JWT token with 7 days expiration
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }  // ✅ 7 days expiration
    )

    // ✅ Set cookie with 7 days expiration
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000  // ✅ 7 days in milliseconds
    })

    res.status(200).json({
      message: "User logged in successfully 🎉",
      success: true,
      user: {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName
      }
    })
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong during Login 🚨",
      success: false,
    })
  }
}

//logout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })
    res.status(200).json({
      message: "User logged out successfully 🎉",
      success: true,
    })
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong during Logout 🚨",
      success: false,
    })
  }
}

//auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized User 🚨",
      success: false,
    })
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decodedData
    next()
  }
  catch (error) {
    console.log(error)
    res.status(401).json({
      message: "Unauthorized User 🚨",
      success: false,
    })
  }
}

module.exports = { registerUser, loginUser, logoutUser, authMiddleware }
