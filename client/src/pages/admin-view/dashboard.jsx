import React, { useState, useEffect } from "react"
import ProductImageUpload from "@/components/admin-view/image-upload"
import { useDispatch, useSelector } from "react-redux"
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const dispatch = useDispatch()
  const { featureImageList } = useSelector((state) => state.commonFeature)

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages())
        setImageFile(null)
        setUploadedImageUrl("")
        toast.success("Feature image uploaded successfully!")
      } else {
        toast.error("Failed to upload image")
      }
    })
  }

  // ✅ DELETE FUNCTION
  function handleDeleteFeatureImage(id) {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this feature image?")) {
      dispatch(deleteFeatureImage(id)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages())
          toast.success("Feature image deleted successfully!")
        } else {
          toast.error("Failed to delete image")
        }
      })
    }
  }

  useEffect(() => {
    dispatch(getFeatureImages())
  }, [dispatch])

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold">Upload Feature Image</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Add images to showcase on the homepage
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button 
            onClick={handleUploadFeatureImage} 
            className="w-full gap-2"
            disabled={!uploadedImageUrl || imageLoadingState}
          >
            <Upload className="h-4 w-4" />
            Upload Feature Image
          </Button>
        </CardContent>
      </Card>

      {/* Feature Images List */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold">Feature Images</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Currently uploaded feature images
                </p>
              </div>
            </div>
            {featureImageList && featureImageList.length > 0 && (
              <Badge variant="secondary">
                {featureImageList.length} {featureImageList.length === 1 ? 'Image' : 'Images'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {featureImageList && featureImageList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featureImageList.map((featureImgItem, index) => (
                <Card key={featureImgItem._id || index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={featureImgItem.image}
                      alt={`Feature ${index + 1}`}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      {/* ✅ ADDED onClick handler */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity gap-2"
                        onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      Image {index + 1}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-muted-foreground">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 opacity-50" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Feature Images</h3>
              <p className="text-sm sm:text-base text-center max-w-sm">
                Upload your first feature image to showcase on the homepage
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
