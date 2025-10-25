import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Package, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage({ onNavigate = () => {} }) {
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }));
    setConfetti(particles);
  }, []);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            animation: `fall ${particle.duration}s ease-in ${particle.delay}s`,
            opacity: 0,
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
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
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes floating {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .shimmer {
          animation: shimmer 2s infinite;
        }
        
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
      `}</style>

      <Card className={`relative p-6 sm:p-10 max-w-md w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 ${isVisible ? 'animate-slideUp' : 'opacity-0'}`}>
        {/* Success Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className={`relative ${isVisible ? 'animate-scaleIn' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-4 sm:p-6">
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <CardHeader className="p-0 text-center space-y-2 sm:space-y-3">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            <CardTitle className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Payment Successful!
            </CardTitle>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </div>
          
          <p className="text-gray-600 text-base sm:text-lg px-2">
            Your order has been confirmed and is being processed
          </p>
        </CardHeader>

        {/* Success message with animated text */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent shimmer"></div>
          <div className="relative">
            <p className="text-center text-emerald-700 font-semibold text-base sm:text-lg mb-2 animate-bounce">
              🎊 Order Confirmed! 🎊
            </p>
            <p className="text-center text-emerald-600 text-sm sm:text-base floating">
              Your items are on their way to making you happy
            </p>
          </div>
        </div>

        <Button 
          className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-5 sm:py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base" 
          onClick={() => navigate("/shop/account")}
        >
          <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          View Orders
        </Button>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
          Thank you for shopping with us! 🎉
        </p>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;