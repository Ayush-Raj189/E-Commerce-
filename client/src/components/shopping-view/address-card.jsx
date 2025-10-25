import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { MapPin, Phone, MapPinned, Hash, FileText, Edit, Trash2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`w-full flex flex-col transition-all duration-300 hover:shadow-lg cursor-pointer group ${
        selectedId?._id === addressInfo?._id
          ? "border-2 border-primary shadow-md ring-2 ring-primary/20"
          : "border-2 border-transparent hover:border-primary/30"
      }`}
    >
      {/* Selected Indicator */}
      {selectedId?._id === addressInfo?._id && (
        <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <CardContent className="flex-1 p-4 sm:p-5 space-y-3">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Address</p>
            <p className="text-sm font-medium text-foreground break-words">
              {addressInfo?.address || "Not provided"}
            </p>
          </div>
        </div>

        {/* City */}
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPinned className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">City</p>
            <p className="text-sm font-medium text-foreground">
              {addressInfo?.city || "Not provided"}
            </p>
          </div>
        </div>

        {/* Pincode */}
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Hash className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Pincode</p>
            <p className="text-sm font-medium text-foreground">
              {addressInfo?.pincode || "Not provided"}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Phone</p>
            <p className="text-sm font-medium text-foreground">
              {addressInfo?.phone || "Not provided"}
            </p>
          </div>
        </div>

        {/* Notes (if exists) */}
        {addressInfo?.notes && (
          <div className="flex items-start gap-3 pt-2 border-t">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-muted-foreground italic break-words">
                {addressInfo.notes}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 sm:p-4 mt-auto bg-muted/30 border-t">
        <div className="flex justify-between w-full gap-2 sm:gap-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleEditAddress(addressInfo);
            }}
            variant="outline"
            size="sm"
            className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Edit</span>
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAddress(addressInfo);
            }}
            variant="outline"
            size="sm"
            className="flex-1 gap-2 text-red-600 hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
