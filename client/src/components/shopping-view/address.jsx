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
    <Card className="w-full max-w-6xl mx-auto shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
      {/* Address Cards Grid */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Addresses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 auto-rows-fr">
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
            <div className="col-span-full text-center py-8 text-gray-500">
              No addresses found. Add your first address below.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Address Form */}
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-800">
          {currentEditId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-6">
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
  )
}

export default AddressComponent
