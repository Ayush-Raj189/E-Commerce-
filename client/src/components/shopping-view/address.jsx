import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CommonForm from "../common/form"
import { addressFormControls } from "../config"
import { useDispatch, useSelector } from "react-redux"
import {
  addNewAddress,
  fetchAllAddress,
  deleteAddress,
  editAddress,
} from "@/store/shop/address-slice"
import AddressCard from "./address-card"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { MapPin, Plus } from "lucide-react"

const initialAddressFormData = {
  phone: "",
  address: "",
  city: "",
  pincode: "",
  notes: "",
}

const AddressComponent = ({setCurrentSelectedAddress, selectedId}) => {
  const [formData, setFormData] = useState(initialAddressFormData)
  const [currentEditId, setCurrentEditId] = useState(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { addressList } = useSelector((state) => state.shopAddress)

  const handleManageAddress = (e) => {
    e.preventDefault()

    if (addressList.length >= 3 && currentEditId === null) {
      setFormData(initialAddressFormData)
      toast.error("You can add up to 3 addresses only")
      return
    }

    currentEditId !== null
      ? dispatch(
          editAddress({
            userId: user?.id,
            addressId: currentEditId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id))
            setCurrentEditId(null)
            setFormData(initialAddressFormData)
            toast.success(data?.payload?.message)
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id))
            setFormData(initialAddressFormData)
            toast.success(data?.payload?.message)
          }
        })
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress(user?.id))
        toast.success(data?.payload?.message)
      }
    })
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditId(getCurrentAddress._id)
    setFormData({
      phone: getCurrentAddress.phone,
      address: getCurrentAddress.address,
      city: getCurrentAddress.city,
      pincode: getCurrentAddress.pincode,
      notes: getCurrentAddress.notes,
    })
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item)
  }

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id))
  }, [dispatch, user?.id])

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <Card className="shadow-lg border-2">
        {/* Address Cards Section */}
        <div className="p-4 sm:p-6 lg:p-8 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Your Addresses
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage up to 3 delivery addresses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {addressList && addressList.length > 0 ? (
              addressList.map((singleAddressItem) => (
                <AddressCard
                  selectedId={selectedId}
                  handleDeleteAddress={handleDeleteAddress}
                  handleEditAddress={handleEditAddress}
                  addressInfo={singleAddressItem}
                  key={singleAddressItem._id}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
              ))
            ) : (
              <div className="col-span-full">
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No addresses yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Add your first delivery address to get started with your orders
                  </p>
                </div>
              </div>
            )}
          </div>

          {addressList && addressList.length < 3 && (
            <div className="mt-6 p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
              <Plus className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {addressList?.length === 0 
                    ? "Add your first address below" 
                    : `You can add ${3 - addressList.length} more ${addressList.length === 2 ? 'address' : 'addresses'}`
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Fill in the form below to add a new delivery address
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Address Form */}
        <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6">
          <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            {currentEditId !== null ? (
              <>
                <MapPin className="h-5 w-5 text-primary" />
                Edit Address
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Add New Address
              </>
            )}
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {currentEditId !== null 
              ? "Update your delivery address information" 
              : "Enter your delivery address details"
            }
          </p>
        </CardHeader>

        <CardContent className="pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8">
          <CommonForm
            formData={formData}
            setFormData={setFormData}
            formControls={addressFormControls}
            buttonText={
              currentEditId !== null ? "Update Address" : "Add Address"
            }
            onSubmit={handleManageAddress}
            isButtonDisabled={!isFormValid()}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AddressComponent
