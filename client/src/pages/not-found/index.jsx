import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search, ShoppingBag } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] sm:text-[200px] md:text-[250px] font-bold text-primary/10 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Search className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-primary" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline"
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            className="w-full sm:w-auto gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/shop/home')} 
            variant="outline"
            className="w-full sm:w-auto gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="font-semibold">Popular Pages</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="font-semibold">New Arrivals</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="font-semibold">Best Sellers</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="font-semibold">Contact Us</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
