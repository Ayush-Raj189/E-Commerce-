import React, { Fragment } from 'react'
import { ChartNoAxesCombined, LayoutDashboard, ShoppingBasket, BadgeCheck } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Separator } from '../ui/separator'

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
]

function MenuItems({ setOpen }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="mt-6 sm:mt-8 flex-col flex gap-1.5">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path)
              setOpen ? setOpen(false) : null
            }}
            className={`group flex cursor-pointer text-sm sm:text-base items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
            }`}
          >
            <span className={`h-5 w-5 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}>
              {menuItem.icon}
            </span>
            <span className="font-medium">{menuItem.label}</span>
            {isActive && (
              <span className="ml-auto h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
            )}
          </div>
        )
      })}
    </nav>
  )
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate()

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 sm:w-72 p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 sm:px-6 py-5">
              <SheetTitle className="flex items-center gap-2.5">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                  <ChartNoAxesCombined className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">Management System</p>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="px-3 sm:px-4 flex-1">
              <MenuItems setOpen={setOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 lg:w-72 flex-col border-r bg-background p-5 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2.5 p-3 rounded-xl hover:bg-muted transition-all duration-200 mb-2"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
            <ChartNoAxesCombined className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
        <Separator className="my-4" />
        <MenuItems />
      </aside>
    </Fragment>
  )
}

export default AdminSideBar
