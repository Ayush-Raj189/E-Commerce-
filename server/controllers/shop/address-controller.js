const Address = require("../../models/Address");

const addAddress = async (req, res) => {
    try {
        const { userId, address, city, pincode, phone, notes } = req.body;

        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const newAddress = new Address({
            userId,
            address,
            city,
            pincode,
            phone,
            notes
        })

        await newAddress.save()
        return res.status(200).json({
            success: true,
            data: newAddress,
            message: "Address added successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            })
        }

        const addressList = await Address.find({ userId })

        return res.status(200).json({
            success: true,
            data: addressList,
            message: "Address fetched successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

const editAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const formdata=req.body

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Address ID are required"
            })
        }

        const address=await Address.findOneAndUpdate({_id:addressId,userId:userId},formdata,{new:true})

        if(!address){
            return res.status(404).json({
                success:false,
                message:"Address not found"
            })
        }

        return res.status(200).json({
            success:true,
            data:address,
            message:"Address updated successfully 🎉"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

const deleteAddress = async (req, res) => {
    try {
      const {userId,addressId}=req.params
      if(!userId || !addressId){
        return res.status(400).json({
            success:false,
            message:"User ID and Address ID are required"
        })
      }
   
      const address=await Address.findOneAndDelete({_id:addressId,userId:userId})

      if(!address)
        return res.status(404).json({
            success:false,
            message:"Address not found"
        })

        return res.status(200).json({
            success:true,
            data:address,
            message:"Address deleted successfully 🎉"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

module.exports = {
    addAddress,
    fetchAllAddress,
    editAddress,
    deleteAddress
}
