import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, LogOut, Shield } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch()
  
  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
      {/* Left Section - Menu Button */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Button 
          onClick={() => setOpen(true)} 
          className="lg:hidden" 
          variant="outline" 
          size="icon"
        >
          <AlignJustify className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        {/* Admin Badge - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Admin Panel</span>
        </div>
      </div>

      {/* Right Section - Logout Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button 
          onClick={handleLogout} 
          variant="destructive"
          size="sm"
          className="gap-2 h-9 sm:h-10 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden xs:inline sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader
