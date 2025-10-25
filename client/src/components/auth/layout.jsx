import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Star, ShoppingCart } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Side - Neon Gradient & Animation */}
      <div className="hidden lg:flex relative items-center justify-center w-1/2 overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        {/* Animated Background Gradient Blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 blur-3xl animate-pulse"></div>

        {/* Floating Neon Icons */}
        <motion.div
          className="absolute top-16 left-1/3 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ShoppingBag size={45} />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-1/3 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          animate={{ y: [0, -25, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, delay: 0.4 }}
        >
          <ShoppingCart size={45} />
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/4 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}
        >
          <Star size={40} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/4 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
          animate={{ y: [0, -18, 0] }}
          transition={{ repeat: Infinity, duration: 2.7, delay: 0.6 }}
        >
          <Sparkles size={42} />
        </motion.div>

        {/* Text Section */}
        <div className="relative z-10 text-center px-10">
          <motion.h1
            className="text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              ECommerce Shopping
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-gray-300 text-lg leading-relaxed max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Explore the latest trends, grab exclusive offers, and elevate your shopping experience.
          </motion.p>
        </div>
      </div>

      {/* Right Side - Auth Section */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
