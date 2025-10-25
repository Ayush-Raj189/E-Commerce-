import React, { useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { UploadCloudIcon } from 'lucide-react'
import { FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'
import { useEffect } from 'react'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'

const ProductImageUpload = ({ imageFile,
    setImageFile,
    uploadedImageUrl,
    imageLoadingState,
    setUploadedImageUrl,
    setImageLoadingState,
    isEditMode,
    isCustomStyling=false }) => {
    const inputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };
    const handleImageChange = (e) => {
        console.log(e.target.files);
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setImageFile(selectedFile);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    async function uploadImageToCloudinary() {
        setImageLoadingState(true);
        const data = new FormData();
        data.append("my_file", imageFile);
        const response = await axios.post(
            "http://localhost:5000/api/admin/products/upload-image",
            data
        );
        console.log(response, "response");

        if (response?.data?.success) {
            setUploadedImageUrl(response.data.result.url);
            setImageLoadingState(false);
        }
    }

    useEffect(() => {
        if (imageFile !== null) uploadImageToCloudinary();
    }, [imageFile]);

    return (
        <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
            <Label className='text-lg font-semibold mb-2 block ml-4 h '>Upload Image</Label>
            <div onDragOver={handleDragOver} onDrop={handleDrop} className={` ${isEditMode ? "opacity-50" : ""} m-4 border-2 border-dashed border-gray-300 rounded-lg p-4`}>
                <Input className='ml-4 hidden' id="image-upload" type="file" ref={inputRef} onChange={handleImageChange} disabled={isEditMode} />
                {
                    !imageFile ? (
                        <Label htmlFor="image-upload" className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}>
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                            <span>Drag & drop or click to upload image</span>
                        </Label>) : ( imageLoadingState ? <Skeleton className='h-10 bg-gray-100'/> :
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <FileIcon className="w-8 text-primary mr-2 h-8" />
                                <p className="text-sm font-medium">{imageFile.name}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={handleRemoveImage}
                            >
                                <XIcon className="w-4 h-4" />
                                <span className="sr-only">Remove File</span>
                            </Button>

                        </div>

                    )}
            </div>
        </div>
    )
}

export default ProductImageUpload
