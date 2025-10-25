# E-Commerce Web Application

Welcome to the E-Commerce Web Application - a comprehensive online shopping platform designed to provide a seamless shopping experience with advanced features for users and admins.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This project is a full-stack e-commerce web application that enables users to browse products, manage carts, place orders, and leave reviews. Admins can manage products, orders, and homepage featured images seamlessly through an admin panel.

The application emphasizes performance, security, and user-friendly interfaces, making it ideal for online retail businesses.

---

## Demo

[Live Demo URL](https://e-commerce-frontend-rosy-nu.vercel.app/)  
![Screenshot](<img width="2380" height="1542" alt="image" src="https://github.com/user-attachments/assets/ca44d53b-2cba-4029-a7f8-41c22061c9a0" />


---

## Features

| Feature                  | Description                                                        |
|--------------------------|--------------------------------------------------------------------|
| User Registration & Login| Secure user signup and authentication with JWT tokens             |
| Product Management       | Admin can add, edit, and delete products                           |
| Featured Images          | Upload and manage homepage feature images                         |
| Shopping Cart            | Add/remove products and manage cart items                         |
| Order Management         | Place orders and track status                                     |
| Product Reviews          | Users can rate and review products                                |
| Secure Payment           | Integration with PayPal for payment processing                    |
| Image Upload             | Powered by Cloudinary for reliable image hosting                 |
| Responsive Design        | Fully responsive UI for desktop and mobile devices               |
| CORS & Security          | Proper CORS configuration and secure cookies                     |

---

## Technologies Used

| Category       | Technologies                        |
|----------------|-----------------------------------|
| Frontend       | React, Redux, React Router        |
| Backend        | Node.js, Express                  |
| Database       | MongoDB (Atlas)                   |
| Authentication | JWT, bcryptjs                     |
| Payments       | PayPal SDK                       |
| Image Hosting  | Cloudinary                       |
| Dev Tools      | Vercel (Deployment), Nodemon      |

---

## Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account with cluster setup
- PayPal developer account
- Cloudinary account

### Clone the Repository
git clone https://github.com/Ayush-Raj189/E-Commerce-.git
cd e-commerce-project

### Backend Setup
cd server
npm install

### Frontend Setup
cd ../client
npm install
npm run dev



---

## Usage

- Visit `http://localhost:5173` for the frontend
- Register a new user or login to start shopping
- Admin panel available at `/admin` route with sign-in credentials
- Product listing, cart, checkout, and order status pages available for users

---

## Contribution

Contributions are welcome! Please follow these steps:

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/yourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to branch (`git push origin feature/yourFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Shopping!**

