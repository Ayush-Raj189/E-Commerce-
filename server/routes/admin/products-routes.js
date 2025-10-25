const express = require("express");
const router = express.Router();
const { addProduct, fetchAllProduct, EditProduct, DeleteProduct } = require("../../controllers/admin/products-controller");

const { handleImageUpload } = require("../../controllers/admin/products-controller");
const { upload } = require("../../helpers/cloudinary");

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", EditProduct);
router.delete("/delete/:id", DeleteProduct);
router.get("/get", fetchAllProduct);

module.exports = router;
