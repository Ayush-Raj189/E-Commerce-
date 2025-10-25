import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '@/components/ui/dialog'
import AdminOrderDetailsView from './order-details'
import { useSelector, useDispatch } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice'
import { Badge } from '../ui/badge'
import { Eye, Package, Calendar, DollarSign } from 'lucide-react'

const AdminOrders = () => {
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder)
  const dispatch = useDispatch()

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId))
    setOpenDetailDialog(true)
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin())
  }, [dispatch])

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailDialog(true)
  }, [orderDetails])

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 hover:bg-green-600"
      case "rejected":
        return "bg-red-500 hover:bg-red-600"
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "inProcess":
        return "bg-blue-500 hover:bg-blue-600"
      case "inShipping":
        return "bg-purple-500 hover:bg-purple-600"
      case "delivered":
        return "bg-emerald-500 hover:bg-emerald-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">All Orders</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage and view all customer orders
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 sm:p-6">
        {/* Desktop Table View */}
        <div className="hidden md:block rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Amount</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium font-mono text-xs">
                      {orderItem?._id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{orderItem?.orderDate.split("T")[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(orderItem?.orderStatus)} text-white`}>
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      <div className="flex items-center justify-end gap-1">
                        <DollarSign className="h-4 w-4" />
                        {orderItem?.totalAmount}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => handleFetchOrderDetails(orderItem?._id)} 
                        size="sm"
                        className="gap-1.5"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3 p-3">
          {orderList && orderList.length > 0 ? (
            orderList.map((orderItem) => (
              <Card key={orderItem?._id} className="shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Order ID</p>
                      <p className="font-mono text-xs font-medium">{orderItem?._id}</p>
                    </div>
                    <Badge className={`${getStatusColor(orderItem?.orderStatus)} text-white text-xs`}>
                      {orderItem?.orderStatus}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{orderItem?.orderDate.split("T")[0]}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {orderItem?.totalAmount}
                    </div>
                    <Button 
                      onClick={() => handleFetchOrderDetails(orderItem?._id)} 
                      size="sm"
                      className="gap-1.5"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders found</p>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog 
        open={openDetailDialog} 
        onOpenChange={() => {
          setOpenDetailDialog(false)
          dispatch(resetOrderDetails())
        }}
      >
        <AdminOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </Card>
  )
}

export default AdminOrders
