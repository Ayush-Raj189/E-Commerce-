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
        <SheetContent className="p-6 sm:p-8 bg-white rounded-lg shadow-md">
            <SheetHeader>
                <SheetTitle className="text-2xl font-extrabold text-gray-900">Your Cart</SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-4">
                {
                    cartItems && cartItems.length > 0
                        ? cartItems.map((item) => <UserCartItemsContent key={item.productId} cartItem={item} />)
                        : null
                }
            </div>

            <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-gray-800">Total</span>
                    <span className="font-bold text-xl text-gray-800">${totalCartAmount}</span>
                </div>
            </div>

            <Button onClick={() => {
                navigate('/shop/checkout')
                 setOpenCartSheet(false);
            }}
                className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg">
                Checkout
            </Button>
        </SheetContent>
    )
}

export default UserCartWrapper
