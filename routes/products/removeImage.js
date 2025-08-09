// routes/products/deleteImage.js
const express = require("express");
const router = express.Router();
const {
  supabase,
  supabaseServiceRole,
} = require("../../config/supabaseConfig");

// DELETE /api/products/deleteImage
router.delete("/", async (req, res) => {
  try {
    const { image_url, id } = req.body;
    // console.log(image_url);
    // console.log(id);

    if (!image_url || !id) {
      return res
        .status(400)
        .json({ success: false, error: "image_url and id are required" });
    }

    // Extract file path from public URL
    const path = image_url.split("/").slice(-2).join("/");
    // console.log(path);

    // Remove image from Supabase storage
    const { error: storageError } = await supabaseServiceRole.storage
      .from("products")
      .remove([path]);
    // console.log(storageError);

    if (storageError) {
      throw new Error(
        "Failed to delete image from storage: " + storageError.message
      );
    }

    // Remove DB record
    const { error: dbError } = await supabase
      .from("product_images")
      .delete()
      .eq("id", id);

    if (dbError) {
      throw new Error(
        "Failed to delete image from database: " + dbError.message
      );
    }

    return res.status(200).json({
      success: true,
      data: "Deleted successfully",
    });
  } catch (err) {
    console.error("Delete image error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
});

module.exports = router;
