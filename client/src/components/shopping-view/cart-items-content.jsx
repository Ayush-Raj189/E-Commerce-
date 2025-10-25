import React from 'react'
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteCartItem } from '@/store/shop/cart-slice';
import { useSelector } from 'react-redux';
import { updateCartQuantity } from '@/store/shop/cart-slice';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const UserCartItemsContent = ({ cartItem }) => {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { productList } = useSelector((state) => state.shopProduct);
    const { cartItems } = useSelector((state) => state.shopCart);

    function handleUpdateQuantity(getCartItem, typeOfAction) {
        if (typeOfAction === "plus") {
            let getCartItems = cartItems || [];

            if (getCartItems.length) {
                const indexOfCurrentCartItem = getCartItems.findIndex(
                    (item) => item.productId === getCartItem?.productId
                );

                const getCurrentProductIndex = productList.findIndex(
                    (product) => product._id === getCartItem?.productId
                );
                const getTotalStock = productList[getCurrentProductIndex].totalStock;

                console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

                if (indexOfCurrentCartItem > -1) {
                    const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
                    if (getQuantity + 1 > getTotalStock) {
                        toast.error(
                            `Only ${getQuantity} quantity can be added for this item`,
                        )
                        return;
                    }
                }
            }
        }
        dispatch(
            updateCartQuantity({
                userId: user?.id,
                productId: getCartItem?.productId,
                quantity:
                    typeOfAction === "plus"
                        ? getCartItem?.quantity + 1
                        : getCartItem?.quantity - 1,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message, {
                    position: "bottom-right"
                });
            }
        });
    }

    function handleCartItemDelete(getCartItem) {
        dispatch(
            deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
        ).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message, {
                    position: "bottom-right"
                });
            }
        });
    }

    return (
        <div className="flex items-center space-x-4">
            <img
                src={cartItem?.image}
                alt={cartItem?.title}
                className="w-20 h-20 rounded object-cover"
            />
            <div className="flex-1">
                <h3 className="font-extrabold text-start">{cartItem?.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <Button
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        size="icon"
                        disabled={cartItem?.quantity === 1}
                        onClick={() => handleUpdateQuantity(cartItem, "minus")}
                    >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Decrease</span>
                    </Button>
                    <span className="font-semibold">{cartItem?.quantity}</span>
                    <Button
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        size="icon"
                        onClick={() => handleUpdateQuantity(cartItem, "plus")}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="sr-only">Increase</span>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">
                    $
                    {(
                        (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
                        cartItem?.quantity
                    ).toFixed(2)}
                </p>
                <Trash onClick={() => handleCartItemDelete(cartItem)}
                    className="cursor-pointer mt-1"
                    size={20}
                />
            </div>
        </div>
    )
}

export default UserCartItemsContent;