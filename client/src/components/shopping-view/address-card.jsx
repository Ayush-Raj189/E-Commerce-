import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

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
      className={`w-full flex flex-col border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 rounded-xl bg-white min-h-[260px] cursor-pointer ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[2px]"
          : "border-gray-200"
      }`}
    >
      <CardContent className="flex-1 p-5 space-y-3">
        <div className="space-y-2">
          <p className="text-[15px] text-gray-800">
            <span className="font-semibold text-gray-700">Address:</span>{" "}
            {addressInfo?.address || "Not provided"}
          </p>
          <p className="text-[15px] text-gray-800">
            <span className="font-semibold text-gray-700">City:</span>{" "}
            {addressInfo?.city || "Not provided"}
          </p>
          <p className="text-[15px] text-gray-800">
            <span className="font-semibold text-gray-700">Pincode:</span>{" "}
            {addressInfo?.pincode || "Not provided"}
          </p>
          <p className="text-[15px] text-gray-800">
            <span className="font-semibold text-gray-700">Phone:</span>{" "}
            {addressInfo?.phone || "Not provided"}
          </p>
          {addressInfo?.notes && (
            <p className="text-[15px] text-gray-800">
              <span className="font-semibold text-gray-700">Notes:</span>{" "}
              {addressInfo.notes}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 mt-auto">
        <div className="flex justify-between w-full gap-3">
          <Button
            onClick={() => handleEditAddress(addressInfo)}
            className="flex-1 text-sm py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-md px-2"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteAddress(addressInfo)}
            className="flex-1 text-sm py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-md px-2"
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;