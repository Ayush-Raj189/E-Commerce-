import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ShoppingOrders from '@/components/shopping-view/orders'
import Address from '@/components/shopping-view/address'
import { Package, MapPin, User, Sparkles } from 'lucide-react'
import { useSelector } from 'react-redux'

const ShoppingAccount = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner with Gradient */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] w-full overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 opacity-20">
          <Sparkles className="h-16 w-16 sm:h-20 sm:w-20 text-white animate-pulse" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-20">
          <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-white animate-pulse" style={{animationDelay: '1s'}} />
        </div>

        {/* User Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/30 to-transparent">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  My Account
                </h1>
                <p className="text-xs sm:text-sm text-white/90 drop-shadow">
                  Welcome back, {user?.userName || 'User'}!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
        <div className="rounded-xl border-2 bg-card shadow-lg overflow-hidden">
          <Tabs defaultValue="orders" className="w-full">
            {/* Enhanced Tabs List */}
            <TabsList className="w-full justify-start gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b h-auto flex-wrap sm:flex-nowrap">
              <TabsTrigger 
                value="orders" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base flex-1 sm:flex-initial min-w-[120px]"
              >
                <Package className="h-4 w-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="address" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base flex-1 sm:flex-initial min-w-[120px]"
              >
                <MapPin className="h-4 w-4" />
                <span>Address</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="p-0">
              <TabsContent value="orders" className="m-0 p-4 sm:p-6">
                <ShoppingOrders />
              </TabsContent>
              <TabsContent value="address" className="m-0 p-4 sm:p-6">
                <Address />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ShoppingAccount
