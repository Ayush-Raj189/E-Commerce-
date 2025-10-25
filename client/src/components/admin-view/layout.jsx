import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSideBar from './sidebar'
import AdminHeader from './header'

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Admin Sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <AdminHeader setOpen={setOpenSidebar} />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-muted/40 p-3 sm:p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
