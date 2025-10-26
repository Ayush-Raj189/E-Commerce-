import React, { useState } from 'react'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import CommonForm from '../common/form'
import { useSelector, useDispatch } from 'react-redux'
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus
} from '@/store/admin/order-slice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Package, Calendar, DollarSign, CreditCard, MapPin, User, Phone, FileText } from 'lucide-react'

const initialFormData = {
  status: '',
}

const AdminOrderDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleUpdateStatus = (e) => {
    e.preventDefault()
    const { status } = formData

    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails?._id))
          dispatch(getAllOrdersForAdmin())
          setFormData(initialFormData)
          toast.success(data?.payload?.message)
        }
      })
      .catch(() => {
        toast.error('Failed to update order status')
      })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      case 'inProcess': return 'bg-blue-500'
      case 'inShipping': return 'bg-purple-500'
      case 'delivered': return 'bg-emerald-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <DialogContent className="max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-xl sm:text-2xl font-bold">Order Details</DialogTitle>
        <DialogDescription className="text-sm">
          View and manage the details of this order
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 sm:space-y-6">
        {/* Order Information Card */}
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-3">
            <h3 className="font-semibold text-base sm:text-lg mb-3">Order Information</h3>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">Order ID</span>
                </div>
                <span className="font-mono text-xs sm:text-sm">{orderDetails?._id}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Order Date</span>
                </div>
                <span>{orderDetails?.orderDate?.split('T')[0]}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Total Amount</span>
                </div>
                <span className="font-bold text-base sm:text-lg">${orderDetails?.totalAmount}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Payment Method</span>
                </div>
                <span className="capitalize">{orderDetails?.paymentMethod}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Payment Status</span>
                </div>
                <span className="capitalize">{orderDetails?.paymentStatus}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">Order Status</span>
                </div>
                <Badge className={`${getStatusColor(orderDetails?.orderStatus)} text-white`}>
                  {orderDetails?.orderStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Order Items Card */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-3">Order Items</h3>
            <div className="space-y-3">
              {orderDetails?.cartItems?.length > 0 ? (
                orderDetails.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm sm:text-base">{item.title}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-sm sm:text-base">${item.price}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No items found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Shipping Information Card */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-3">Shipping Information</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>{user?.userName}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p>{orderDetails?.addressInfo?.address}</p>
                  <p>{orderDetails?.addressInfo?.city}</p>
                  <p>{orderDetails?.addressInfo?.pincode}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>{orderDetails?.addressInfo?.phone}</span>
              </div>
              {orderDetails?.addressInfo?.notes && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="italic text-muted-foreground">{orderDetails?.addressInfo?.notes}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Update Status Form */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-4">Update Order Status</h3>
            <CommonForm
              formControls={[
                {
                  label: 'Order Status',
                  name: 'status',
                  componentType: 'select',
                  options: [
                    { id: 'pending', label: 'Pending' },
                    { id: 'inProcess', label: 'In Process' },
                    { id: 'inShipping', label: 'In Shipping' },
                    { id: 'delivered', label: 'Delivered' },
                    { id: 'rejected', label: 'Rejected' },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText="Update Status"
              onSubmit={handleUpdateStatus}
            />
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  )
}

export default AdminOrderDetailsView
