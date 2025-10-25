import React from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { HousePlug, Menu, ShoppingCart, UserCog, LogOut, Store, Mail, Home, User, Users, Baby, Sparkles, Search } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from '../ui/dropdown-menu'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'
import UserCartWrapper from './cart-wrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { useState, useEffect } from 'react'
import { shoppingViewHeaderMenuItems } from '../config'

// Icon mapping for menu items
const getMenuIcon = (menuId) => {
  const icons = {
    home: Home,
    products: Store,
    men: User,
    women: Users,
    kids: Baby,
    accessories: Sparkles,
    footwear: Sparkles,
    search: Search,
  };
  return icons[menuId] || Store;
};

function MenuItems({ isMobile = false, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
    
    if (isMobile && onNavigate) {
      onNavigate();
    }
  }

  return (
    <nav className={`flex ${isMobile ? 'flex-col space-y-1' : 'flex-row items-center gap-6'}`}>
      {shoppingViewHeaderMenuItems.map((menuItem) => {
        const Icon = getMenuIcon(menuItem.id);
        
        return (
          <button
            key={menuItem.id}
            onClick={() => handleNavigate(menuItem)}
            className={`
              ${isMobile 
                ? 'w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors text-base font-medium flex items-center gap-3 group' 
                : 'text-sm font-medium hover:text-primary transition-colors'
              }
            `}
          >
            {isMobile && (
              <Icon className="h-4 w-4 group-hover:text-primary transition-colors" />
            )}
            {menuItem.label}
          </button>
        );
      })}
    </nav>
  )
}

function MobileSidebar({ isOpen, onClose }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  const handleAccountClick = () => {
    navigate("/shop/account");
    onClose();
  };

  const handleCartClick = () => {
    setOpenCartSheet(true);
    onClose();
  };

  const cartItemsCount = cartItems?.items?.length || 0;

  return (
    <>
      <SheetContent 
        side="left" 
        className="w-[300px] sm:w-[340px] p-0 flex flex-col"
      >
        {/* Enhanced Profile Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 bg-gradient-to-br from-primary to-primary/70 shadow-md">
                <AvatarFallback className='text-white font-bold text-lg'>
                  {user?.userName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {/* Online Status Indicator */}
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base font-semibold truncate">
                {user?.userName || 'User'}
              </SheetTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{user?.email || ''}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Shop Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Store className="h-3.5 w-3.5" />
                <span>Shop</span>
              </div>
              <MenuItems isMobile onNavigate={onClose} />
            </div>

            <Separator />

            {/* Shopping Cart Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Shopping</span>
              </div>
              <button
                onClick={handleCartClick}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors text-base font-medium flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4 group-hover:text-primary transition-colors" />
                  <span>My Cart</span>
                </div>
                {cartItemsCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground font-semibold">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </Badge>
                )}
              </button>
            </div>

            <Separator />

            {/* Account Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <UserCog className="h-3.5 w-3.5" />
                <span>Account</span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={handleAccountClick}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors text-base font-medium flex items-center gap-3 group"
                >
                  <UserCog className="h-4 w-4 group-hover:text-primary transition-colors" />
                  <span>My Account</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-base font-medium flex items-center gap-3 text-red-600 group"
                >
                  <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <p className="text-xs text-center text-muted-foreground">
            © 2025 Ecommerce. All rights reserved.
          </p>
        </div>
      </SheetContent>

      {/* Cart Sheet */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <UserCartWrapper 
          setOpenCartSheet={setOpenCartSheet} 
          cartItems={cartItems?.items || []} 
        />
      </Sheet>
    </>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  const cartItemsCount = cartItems?.items?.length || 0;

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Cart Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button 
          onClick={() => setOpenCartSheet(true)} 
          variant="outline" 
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10 hover:border-primary/50 transition-colors"
        >
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
          
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {cartItemsCount > 9 ? '9+' : cartItemsCount}
            </span>
          )}
          
          <span className="sr-only">User Cart</span>
        </Button>
        
        <UserCartWrapper 
          setOpenCartSheet={setOpenCartSheet} 
          cartItems={cartItems?.items || []} 
        />
      </Sheet>

      {/* Enhanced User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0 hover:ring-2 hover:ring-primary/20 transition-all">
            <div className="relative">
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-primary to-primary/70 shadow-sm">
                <AvatarFallback className='text-white font-bold text-sm sm:text-base'>
                  {user?.userName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {/* Online Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent side="right" align="end" className="w-52 sm:w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.userName}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{user?.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer focus:bg-accent"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const ShoppingHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 shadow-sm">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Logo */}
        <Link 
          to="/shop/home" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
        >
          <HousePlug className="h-5 w-5 sm:h-6 sm:w-6 group-hover:text-primary transition-colors" />
          <span className="font-bold text-base sm:text-lg truncate max-w-[120px] sm:max-w-none">
            Ecommerce
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 hover:border-primary/50 transition-colors"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          
          <MobileSidebar 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
          />
        </Sheet>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Desktop Right Content */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
