import React, { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '../ui/badge';
import CommonForm from '../common/form';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus
} from '@/store/admin/order-slice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialFormData = {
  status: '',
};

const AdminOrderDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // --- Handle status update ---
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    const { status } = formData;

    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails?._id));
          dispatch(getAllOrdersForAdmin());
          setFormData(initialFormData);
          toast.success(data?.payload?.message);
        }
      })
      .catch(() => {
        toast.error('Failed to update order status');
      });
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      {/* Accessibility header for Dialog */}
      <DialogHeader>
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription>
          View and manage the details of this order.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 mt-2">
        {/* Basic order info */}
        <div className="grid gap-2">
          <div className="flex mt-4 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate?.split('T')[0]}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === 'confirmed'
                    ? 'bg-green-500'
                    : orderDetails?.orderStatus === 'rejected'
                    ? 'bg-red-600'
                    : 'bg-black'
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        {/* Cart items */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Items</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems?.length > 0 ? (
                orderDetails.cartItems.map((item) => (
                  <li key={item._id} className="flex items-center justify-between">
                    <span>Title: {item.title}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Price: ${item.price}</span>
                  </li>
                ))
              ) : (
                <li>No items found</li>
              )}
            </ul>
          </div>
        </div>

        {/* Shipping info */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Information</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Update status form */}
      <div className="mt-6">
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
          buttonText="Update Order Status"
          onSubmit={handleUpdateStatus}
        />
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetailsView;
