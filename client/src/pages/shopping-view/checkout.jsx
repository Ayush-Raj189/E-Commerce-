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

    setIsPaymentStart(true)

    dispatch(createNewOrder(OrderData)).then((data) => {
      console.log('Order Response:', data) // Debug log
      
      if (data?.payload?.success) {
        // ✅ Fixed: Check for approvalURL in the response
        const paypalURL = data?.payload?.approvalURL
        
        if (paypalURL) {
          console.log('Redirecting to PayPal:', paypalURL) // Debug log
          window.location.href = paypalURL
        } else {
          toast.error('PayPal URL not received. Please try again.')
          setIsPaymentStart(false)
        }
      } else {
        toast.error(data?.payload?.message || 'Failed to initiate payment')
        setIsPaymentStart(false)
      }
    }).catch((error) => {
      console.error('Payment Error:', error)
      toast.error('Error initiating payment. Please try again.')
      setIsPaymentStart(false)
    })
  }

  // ✅ Alternative: Keep this as backup
  useEffect(() => {
    if (approvalURL) {
      console.log('ApprovalURL from Redux:', approvalURL) // Debug log
      window.location.href = approvalURL
    }
  }, [approvalURL])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Animated Hero Banner */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] w-full overflow-hidden">
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
        <div className="absolute top-10 right-10 opacity-20 animate-float">
          <div className="h-20 w-20 rounded-full bg-white blur-2xl"></div>
        </div>
        <div className="absolute bottom-10 left-10 opacity-20 animate-float-delayed">
          <div className="h-16 w-16 rounded-full bg-white blur-2xl"></div>
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-10 animate-pulse">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-10 animate-pulse" style={{animationDelay: '1s'}}>
          <Sparkles className="h-10 w-10 text-white" />
        </div>

        {/* Title Overlay with Glass Effect */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center shadow-2xl animate-bounce-slow">
                <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-2xl">
                  Secure Checkout
                </h1>
                <p className="text-xs sm:text-sm text-white/95 drop-shadow-lg">
                  Complete your purchase securely
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Address */}
          <div className="order-2 lg:order-1">
            <Address 
              selectedId={currentSelectedAddress} 
              setCurrentSelectedAddress={setCurrentSelectedAddress} 
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-1 lg:order-2">
            <Card className="shadow-xl border-2 sticky top-4 overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Package className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6">
                {/* Cart Items */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                    cartItems.items.map((item) => (
                      <UserCartItemsContent key={item?.productId} cartItem={item} />
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="font-medium">Your cart is empty</p>
                      <p className="text-sm mt-1">Add items to proceed</p>
                    </div>
                  )}
                </div>

                {/* Total Section */}
                {cartItems?.items?.length > 0 && (
                  <>
                    <div className="mt-6 pt-6 border-t space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${totalCartAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <span className="font-bold text-lg sm:text-xl">Total</span>
                        </div>
                        <span className="font-bold text-lg sm:text-xl text-primary">
                          ${totalCartAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* PayPal Button */}
                    <div className="mt-6">
                      <Button 
                        onClick={handleInitiatePaypal} 
                        disabled={isPaymentStart}
                        className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold gap-2 hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPaymentStart ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Redirecting to PayPal...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5" />
                            Checkout with PayPal
                          </>
                        )}
                      </Button>
                      
                      {/* Security Badge */}
                      <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Secure payment powered by PayPal
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
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
          width: 6px;
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
