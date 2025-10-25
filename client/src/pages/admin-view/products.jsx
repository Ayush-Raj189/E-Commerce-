import React, { Fragment, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { SheetContent } from '@/components/ui/sheet'
import { SheetHeader } from '@/components/ui/sheet'
import { SheetTitle } from '@/components/ui/sheet'
import CommonForm from '@/components/common/form'
import { addProductFormElements } from '@/components/config'
import ProductImageUpload from '@/components/admin-view/image-upload'
import { useDispatch, useSelector } from 'react-redux'
import { addNewProduct, fetchAllProducts,editProduct } from '@/store/admin/product-slice'
import { toast } from 'react-toastify'
import AdminProductTile from '@/components/admin-view/product-tile'
import { deleteProduct } from '@/store/admin/product-slice'


const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { productsList } = useSelector((state) => state.adminProduct);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    currentEditedId !==null ? 
      dispatch(editProduct({id:currentEditedId,formData})).then((data)=>{
        console.log(data,'edit')

        if(data?.payload?.success){
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setFormData(initialFormData);
          setCurrentEditedId(null);
          toast.success(data?.payload?.message);
        }
      })
    : dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then((data) => {
      console.log(data, 'data');
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        setOpenCreateProductsDialog(false);
        setFormData(initialFormData);
        setImageFile(null);
        toast.success(data?.payload?.message);
      }
    })
  }

  function handleDelete(getCurrentProductId){
    dispatch(deleteProduct(getCurrentProductId)).then((data)=>{
      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        toast.success(data?.payload?.message);
      }
    })
   
  }

  function isFormValid(){
    return Object.values(formData).every((value) => value !== "");
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch])

  console.log(formData, 'productsList');

  return (
    <Fragment>
      <div className='mb-5 flex justify-end'>
        <Button className='bg-primary text-primary-foreground' onClick={() => setOpenCreateProductsDialog(true)}>Add NewProduct</Button>
      </div>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {
          productsList && productsList.length > 0 ? productsList.map((product) => (
            <AdminProductTile key={product._id} product={product} setCurrentEditedId={setCurrentEditedId} setOpenCreateProductsDialog={setOpenCreateProductsDialog} setFormData={setFormData} handleDelete={handleDelete} />
          )) : null
        }
      </div>
      <Sheet open={openCreateProductsDialog} onOpenChange={() => {
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null)
        setFormData(initialFormData);
      }}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Product" : "Add NewProduct"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState} setImageLoadingState={setImageLoadingState} isEditMode={currentEditedId !== null} />
          <div className="m-4">
            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText={currentEditedId ? "Edit Product" : "Add Product"}
              isButtonDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  )
}

export default AdminProducts        