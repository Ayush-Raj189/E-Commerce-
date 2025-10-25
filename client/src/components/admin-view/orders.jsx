import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useState } from 'react'
import AdminOrderDetailsView from './order-details'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getAllOrdersForAdmin } from '@/store/admin/order-slice'
import { getOrderDetailsForAdmin } from '@/store/admin/order-slice'
import { resetOrderDetails } from '@/store/admin/order-slice'
import { Badge } from '../ui/badge'

const AdminOrders = () => {
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();


  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
    setOpenDetailDialog(true);
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-start font-bold'> All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead className="text-right">Order Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) =>
                  <TableRow key={orderItem?._id}>
                    <TableCell className="font-medium text-left">{orderItem?._id}</TableCell>
                    <TableCell className="text-left">{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell className="text-left"><Badge
                      className={`py-1 px-3 ${orderItem?.orderStatus === "confirmed"
                        ? "bg-green-500"
                        : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                        }`}
                    >{orderItem?.orderStatus}</Badge></TableCell>
                    <TableCell className="text-right">${orderItem?.totalAmount}</TableCell>
                    <TableCell className="text-right">
                      <Dialog open={openDetailDialog} onOpenChange={() => {
                        setOpenDetailDialog(false);
                        dispatch(resetOrderDetails());
                      }}>
                        <Button onClick={() => handleFetchOrderDetails(orderItem?._id)} size="sm">View Details</Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>

                    </TableCell>
                  </TableRow>

                ) : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminOrders