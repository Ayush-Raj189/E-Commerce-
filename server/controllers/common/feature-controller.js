const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const featureImages = new Feature({ image });
    await featureImages.save();

    res.status(201).json({
      success: true,
      message: "Feature image added successfully",
      data: featureImages,
    });
  } catch (e) {
    console.error("Add feature image error:", e);
    res.status(500).json({
      success: false,
      message: "Error adding feature image",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.error("Get feature images error:", e);
    res.status(500).json({
      success: false,
      message: "Error fetching feature images",
    });
  }
};

// ✅ ADD DELETE FUNCTION
const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Image ID is required",
      });
    }

    const deletedImage = await Feature.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feature image deleted successfully",
      data: deletedImage,
    });
  } catch (e) {
    console.error("Delete feature image error:", e);
    res.status(500).json({
      success: false,
      message: "Error deleting feature image",
    });
  }
};

module.exports = { 
  addFeatureImage, 
  getFeatureImages, 
  deleteFeatureImage 
};
