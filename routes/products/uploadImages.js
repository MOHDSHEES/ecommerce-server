const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  supabase,
  supabaseServiceRole,
} = require("../../config/supabaseConfig");

const storage = multer.memoryStorage(); // Keep files in memory buffer
const upload = multer({ storage });

// POST /api/products/uploadImages
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const productId = req.body.productId; // <-- now works
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required",
      });
    }

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files uploaded",
      });
    }

    const uploadPromises = [];
    const filePaths = [];

    files.forEach((file) => {
      const fileExt = file.originalname.split(".").pop();
      const filePath = `products/${productId}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 6)}.${fileExt}`;
      filePaths.push(filePath);

      uploadPromises.push(
        supabaseServiceRole.storage
          .from("products")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          })
      );
    });

    const uploadResults = await Promise.all(uploadPromises);
    const errors = uploadResults.filter((result) => result.error);
    if (errors.length > 0) {
      throw new Error(
        "Some file uploads failed: " +
          errors.map((e) => e.error.message).join(", ")
      );
    }

    const imageUrls = filePaths.map(
      (filePath) =>
        supabase.storage.from("products").getPublicUrl(filePath).data.publicUrl
    );

    const galleryRecords = imageUrls.map((url) => ({
      product_id: productId,
      url: url,
    }));

    const { data: insertedData, error: dbError } = await supabase
      .from("product_images")
      .insert(galleryRecords)
      .select("*");

    if (dbError) {
      throw new Error("Failed to save gallery images: " + dbError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: insertedData,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ success: false, error: error || "Server error" });
  }
});

module.exports = router;
