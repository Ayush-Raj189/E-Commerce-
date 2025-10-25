import React from 'react'
import { Link } from 'react-router-dom'
import { HousePlug } from 'lucide-react'
import { Sheet } from '../ui/sheet'
import { SheetTrigger } from '../ui/sheet'
import { SheetContent } from '../ui/sheet'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Label } from '../ui/label'
import { shoppingViewHeaderMenuItems } from '../config'
import { ShoppingCart } from 'lucide-react'
import { DropdownMenu } from '../ui/dropdown-menu'
import { DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar } from '../ui/avatar'
import { AvatarFallback } from '../ui/avatar'
import { AvatarImage } from '../ui/avatar'
import { DropdownMenuContent } from '../ui/dropdown-menu'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { DropdownMenuLabel } from '../ui/dropdown-menu'
import { DropdownMenuSeparator } from '../ui/dropdown-menu'
import { UserCog } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'
import { useState } from 'react'
import UserCartWrapper from './cart-wrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'


function MenuItems() {
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
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  )
}

function HeaderRightContent() {

  const { user } = useSelector((state) => state.auth)
  const {cartItems} = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id))
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>  
      <Button onClick={() => setOpenCartSheet(true)} variant="outline" size="icon">
        <ShoppingCart className="w-6 h-6" />
         <span className="absolute top-[10px] right-[75px] font-bold text-sm">
            {cartItems?.items?.length || 0}
        </span>
        <span className="sr-only">User Cart</span>
      </Button>
      <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
      </Sheet>
     
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className='text-white bg-black font-extrabold'>{user?.userName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleLogout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  )
}

const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs p-6">
            <div className="flex flex-col gap-6">
              <MenuItems />
              <HeaderRightContent />
            </div>
          </SheetContent>

        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />

        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>


      </div>
    </header>
  )
}

export default ShoppingHeader
