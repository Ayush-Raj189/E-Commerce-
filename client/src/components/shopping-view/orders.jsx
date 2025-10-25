import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '@/components/ui/dialog'
import ShoppingOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/shop/order-slice'
import { Badge } from '../ui/badge'
import { Calendar, DollarSign, Eye, Package } from 'lucide-react'

const ShoppingOrders = () => {
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
    setOpenDetailDialog(true);
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailDialog(true);
  }, [orderDetails]);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 hover:bg-green-600";
      case "rejected":
        return "bg-red-500 hover:bg-red-600";
      case "delivered":
        return "bg-blue-500 hover:bg-blue-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "inProcess":
        return "bg-orange-500 hover:bg-orange-600";
      case "inShipping":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-xl sm:text-2xl text-center flex items-center justify-center gap-2">
          <Package className="h-5 w-5 sm:h-6 sm:w-6" />
          Order History
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        {orderList && orderList.length > 0 ? (
          <>
            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden md:block rounded-md border overflow-x-auto">
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
                  {orderList.map((orderItem) => (
                    <TableRow key={orderItem._id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium font-mono text-xs">
                        {orderItem?._id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        {new Date(orderItem?.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(orderItem?.orderStatus)} text-white capitalize`}>
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${orderItem?.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog 
                          open={openDetailDialog} 
                          onOpenChange={() => {
                            setOpenDetailDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button 
                            onClick={() => handleFetchOrderDetails(orderItem?._id)} 
                            size="sm"
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <ShoppingOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View - Hidden on Desktop */}
            <div className="md:hidden space-y-4">
              {orderList.map((orderItem) => (
                <Card key={orderItem._id} className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    {/* Order ID */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Order ID</span>
                      <span className="font-mono text-xs font-medium">
                        #{orderItem?._id.slice(-8)}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Date</span>
                      </div>
                      <span className="text-sm font-medium">
                        {new Date(orderItem?.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={`${getStatusColor(orderItem?.orderStatus)} text-white capitalize`}>
                        {orderItem?.orderStatus}
                      </Badge>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <DollarSign className="h-4 w-4" />
                        <span>Total</span>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        ${orderItem?.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    {/* View Details Button */}
                    <Dialog 
                      open={openDetailDialog} 
                      onOpenChange={() => {
                        setOpenDetailDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button 
                        onClick={() => handleFetchOrderDetails(orderItem?._id)} 
                        className="w-full gap-2 mt-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
            <Package className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders
