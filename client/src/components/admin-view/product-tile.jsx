import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

const AdminProductTile = ({ 
  product, 
  setCurrentEditedId, 
  setOpenCreateProductsDialog, 
  setFormData, 
  handleDelete 
}) => {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative">
        <img 
          src={product?.image} 
          alt={product?.title} 
          className="w-full h-48 sm:h-56 md:h-64 object-cover" 
        />
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h2 className="text-base sm:text-lg font-bold mb-3 line-clamp-2">
          {product?.title}
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-lg font-semibold ${
              product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
            }`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-lg sm:text-xl font-bold text-primary">
              ${product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          onClick={() => {
            setCurrentEditedId(product?._id)
            setOpenCreateProductsDialog(true)
            setFormData(product)
          }}
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button 
          onClick={() => handleDelete(product?._id)}
          variant="destructive"
          size="sm"
          className="flex-1 gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AdminProductTile
