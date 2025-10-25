import React, { useState, useEffect } from 'react'
import Address from '../../components/shopping-view/address'
import { useSelector, useDispatch } from 'react-redux'
import UserCartItemsContent from '../../components/shopping-view/cart-items-content'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createNewOrder } from '@/store/shop/order-slice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ShoppingBag, CreditCard, Loader2, Package, DollarSign, Sparkles } from 'lucide-react'

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart)
  const { user } = useSelector((state) => state.auth)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const [isPaymentStart, setIsPaymentStart] = useState(false)
  const { approvalURL } = useSelector((state) => state.shopOrder)
  const dispatch = useDispatch()

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
      : 0

  function handleInitiatePaypal() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast.error('Your cart is empty.')
      return
    }
    if (!currentSelectedAddress) {
      toast.error('Please select a shipping address.')
      return
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
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: '',
    }

    dispatch(createNewOrder(OrderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true)
      } else {
        setIsPaymentStart(false)
      }
    })
  }

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL
    }
  }, [approvalURL])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Animated Hero Banner */}
      <div className="relative h-[150px] sm:h-[200px] md:h-[250px] lg:h-[280px] w-full overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient-shift"></div>
        
        {/* Animated Dots Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
              animation: 'move 20s linear infinite'
            }}
          ></div>
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-8 right-8 opacity-20 animate-float hidden sm:block">
          <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-white blur-2xl"></div>
        </div>
        <div className="absolute bottom-8 left-8 opacity-20 animate-float-delayed hidden sm:block">
          <div className="h-12 w-12 lg:h-16 lg:w-16 rounded-full bg-white blur-2xl"></div>
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-10 animate-pulse hidden md:block">
          <Sparkles className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-10 animate-pulse hidden md:block" style={{animationDelay: '1s'}}>
          <Sparkles className="h-6 w-6 lg:h-10 lg:w-10 text-white" />
        </div>

        {/* Title Overlay with Glass Effect */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center shadow-2xl animate-bounce-slow">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-2xl">
                  Secure Checkout
                </h1>
                <p className="text-xs sm:text-sm text-white/95 drop-shadow-lg hidden sm:block">
                  Complete your purchase securely
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Address (takes more space on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-7">
            <Address 
              selectedId={currentSelectedAddress} 
              setCurrentSelectedAddress={setCurrentSelectedAddress} 
            />
          </div>

          {/* Right Column - Order Summary (sticky on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-5">
            <div className="lg:sticky lg:top-20">
              <Card className="shadow-xl border-2 overflow-hidden">
                <CardHeader className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-4 sm:p-5">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-3 sm:p-4 lg:p-5">
                  {/* Cart Items */}
                  <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                      cartItems.items.map((item) => (
                        <UserCartItemsContent key={item?.productId} cartItem={item} />
                      ))
                    ) : (
                      <div className="text-center py-8 sm:py-12 text-muted-foreground">
                        <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                        <p className="font-medium text-sm sm:text-base">Your cart is empty</p>
                        <p className="text-xs sm:text-sm mt-1">Add items to proceed</p>
                      </div>
                    )}
                  </div>

                  {/* Total Section */}
                  {cartItems?.items?.length > 0 && (
                    <>
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">${totalCartAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-medium text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 sm:pt-3 border-t">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            <span className="font-bold text-base sm:text-lg lg:text-xl">Total</span>
                          </div>
                          <span className="font-bold text-base sm:text-lg lg:text-xl text-primary">
                            ${totalCartAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* PayPal Button */}
                      <div className="mt-4 sm:mt-6">
                        <Button 
                          onClick={handleInitiatePaypal} 
                          disabled={isPaymentStart}
                          className="w-full h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg font-semibold gap-2 hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                        >
                          {isPaymentStart ? (
                            <>
                              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                              <span className="hidden sm:inline">Processing PayPal Payment...</span>
                              <span className="sm:hidden">Processing...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="hidden sm:inline">Checkout with PayPal</span>
                              <span className="sm:hidden">PayPal Checkout</span>
                            </>
                          )}
                        </Button>
                        
                        {/* Security Badge */}
                        <p className="text-xs text-center text-muted-foreground mt-2 sm:mt-3 flex items-center justify-center gap-1">
                          <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span className="hidden sm:inline">Secure payment powered by PayPal</span>
                          <span className="sm:hidden">Secure PayPal</span>
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  )
}

export default ShoppingCheckout
