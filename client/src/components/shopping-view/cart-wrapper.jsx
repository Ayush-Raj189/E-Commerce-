import React from 'react'
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useNavigate } from "react-router-dom";

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {
    const navigate = useNavigate();

    const totalCartAmount =
        cartItems && cartItems.length > 0
            ? cartItems.reduce(
                (sum, currentItem) =>
                    sum +
                    (currentItem?.salePrice > 0
                        ? currentItem?.salePrice
                        : currentItem?.price) *
                    currentItem?.quantity,
                0
            )
            : 0;

    return (
        <SheetContent className="flex flex-col h-full p-4 sm:p-6 lg:p-8 bg-white">
            {/* Header */}
            <SheetHeader className="pb-4 border-b">
                <SheetTitle className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    Your Cart
                </SheetTitle>
            </SheetHeader>

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto mt-4 sm:mt-6 space-y-3 sm:space-y-4 pr-2">
                {cartItems && cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <UserCartItemsContent key={item.productId} cartItem={item} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <p className="text-base sm:text-lg text-gray-500 mb-2">
                            Your cart is empty
                        </p>
                        <p className="text-sm text-gray-400">
                            Add items to get started!
                        </p>
                    </div>
                )}
            </div>

            {/* Footer - Sticky at bottom */}
            <div className="mt-auto pt-4 border-t space-y-4">
                {/* Total Section */}
                <div className="flex justify-between items-center px-1">
                    <span className="font-bold text-lg sm:text-xl text-gray-800">
                        Total
                    </span>
                    <span className="font-bold text-lg sm:text-xl text-gray-800">
                        ${totalCartAmount.toFixed(2)}
                    </span>
                </div>

                {/* Checkout Button */}
                <Button
                    onClick={() => {
                        navigate('/shop/checkout')
                        setOpenCartSheet(false);
                    }}
                    disabled={!cartItems || cartItems.length === 0}
                    className="w-full py-5 sm:py-6 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-base sm:text-lg rounded-lg transition-colors duration-200"
                >
                    Checkout
                </Button>
            </div>
        </SheetContent>
    )
}

export default UserCartWrapper
