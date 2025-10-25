import React, { Fragment, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CommonForm from '@/components/common/form'
import { addProductFormElements } from '@/components/config'
import ProductImageUpload from '@/components/admin-view/image-upload'
import { useDispatch, useSelector } from 'react-redux'
import { addNewProduct, fetchAllProducts, editProduct, deleteProduct } from '@/store/admin/product-slice'
import { toast } from 'react-toastify'
import AdminProductTile from '@/components/admin-view/product-tile'
import { Plus, Package, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'


const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
}

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const dispatch = useDispatch()
  const { productsList, isLoading } = useSelector((state) => state.adminProduct)
  const [currentEditedId, setCurrentEditedId] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts())
          setOpenCreateProductsDialog(false)
          setFormData(initialFormData)
          setCurrentEditedId(null)
          toast.success(data?.payload?.message)
        }
      })
    } else {
      dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts())
          setOpenCreateProductsDialog(false)
          setFormData(initialFormData)
          setImageFile(null)
          setUploadedImageUrl('')
          toast.success(data?.payload?.message)
        }
      })
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts())
        toast.success(data?.payload?.message)
      }
    })
  }

  function isFormValid() {
    return Object.values(formData).every((value) => value !== "")
  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <Card className="shadow-md border-2">
        <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
          <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Side - Title */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md flex-shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                  Products Management
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Manage your product inventory
                </p>
              </div>
            </div>

            {/* Right Side - Badge & Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {productsList && productsList.length > 0 && (
                <Badge variant="secondary" className="text-xs sm:text-sm font-semibold px-2.5 py-1">
                  {productsList.length} {productsList.length === 1 ? 'Product' : 'Products'}
                </Badge>
              )}
              <Button
                onClick={() => setOpenCreateProductsDialog(true)}
                className="gap-2 shadow-sm"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Add Product</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Products Grid or Empty State */}
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : productsList && productsList.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {productsList.map((product) => (
            <AdminProductTile
              key={product._id}
              product={product}
              setCurrentEditedId={setCurrentEditedId}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setFormData={setFormData}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Package className="h-10 w-10 sm:h-12 sm:w-12 text-primary opacity-50" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-center">No Products Yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-center max-w-sm mb-6">
              Start building your inventory by adding your first product
            </p>
            <Button
              onClick={() => setOpenCreateProductsDialog(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Product Sheet */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenCreateProductsDialog(false)
            setCurrentEditedId(null)
            setFormData(initialFormData)
            setImageFile(null)
            setUploadedImageUrl('')
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto p-0"
        >
          <SheetHeader className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-primary/10 to-transparent sticky top-0 z-10 bg-background">
            <div className="flex items-center justify-between gap-4">
              <SheetTitle className="text-xl sm:text-2xl font-bold">
                {currentEditedId ? "Edit Product" : "Add New Product"}
              </SheetTitle>

              {/* Close Button - More visible on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted"
                onClick={() => {
                  setOpenCreateProductsDialog(false)
                  setCurrentEditedId(null)
                  setFormData(initialFormData)
                  setImageFile(null)
                  setUploadedImageUrl('')
                }}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </SheetHeader>

          <div className="px-4 sm:px-6 py-6 space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Product Image
              </h3>
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
                isEditMode={currentEditedId !== null}
              />
            </div>

            {/* Form Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Product Details
              </h3>
              <CommonForm
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                buttonText={currentEditedId ? "Update Product" : "Add Product"}
                isButtonDisabled={!isFormValid()}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  )
}

export default AdminProducts
