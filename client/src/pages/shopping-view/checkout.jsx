import React from 'react'
import img from '../../assets/account1.webp'
import Address from '../../components/shopping-view/address'
import { useSelector } from 'react-redux'
import UserCartItemsContent from '../../components/shopping-view/cart-items-content'
import { Button } from '../../components/ui/button'
import { useState } from "react"
import { useDispatch } from 'react-redux'
import { createNewOrder } from '@/store/shop/order-slice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart)
  const { user } = useSelector((state) => state.auth)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const { approvalURL } = useSelector((state) => state.shopOrder)
  const dispatch = useDispatch();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;


  function handleInitiatePaypal() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!currentSelectedAddress) {
      toast.error("Please select a shipping address.");
      return;
    }


    const OrderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    }

    dispatch(createNewOrder(OrderData)).then((data) => {
      console.log(data, "Ayush");
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }


  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);


  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
              <UserCartItemsContent key={item?.productId} cartItem={item} />
            ))
            : null}

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xl text-gray-800">Total</span>
              <span className="font-bold text-xl text-gray-800">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={() => handleInitiatePaypal()} className="w-full">
              {
                isPaymentStart ? "Processing PyPal Payment..." : "Checkout with PayPal"
              }
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ShoppingCheckout
