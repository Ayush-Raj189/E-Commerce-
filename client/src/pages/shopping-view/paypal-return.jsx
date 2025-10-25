import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function PaypalReturnPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");

    useEffect(() => {
        if (paymentId && payerId) {
            // Wait 5 seconds before processing payment
            const timer = setTimeout(() => {
                const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

                dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
                    if (data?.payload?.success) {
                        sessionStorage.removeItem("currentOrderId");
                        window.location.href = "/shop/payment-success";
                    }
                });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [paymentId, payerId, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(99, 102, 241, 0.7);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <Card className="relative p-6 sm:p-10 max-w-md w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-slideUp">
        {/* Animated loader icon */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-5 sm:p-6 pulse-glow">
              <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <CardHeader className="p-0 text-center">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent px-2">
            Processing Payment...
          </CardTitle>
          <p className="text-gray-600 text-sm sm:text-base mt-3 sm:mt-4 px-4">
            Please wait!
          </p>
        </CardHeader>

        {/* Decorative loading bar */}
        <div className="mt-6 sm:mt-8 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
          🔒 Secure transaction in progress
        </p>
      </Card>
    </div>
  );
}

export default PaypalReturnPage;