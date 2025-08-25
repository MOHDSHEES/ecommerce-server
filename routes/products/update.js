const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig"); // Adjust path as needed

router.post("/:id", async (req, res) => {
  const productId = req.params.id;
  // console.log(productId);

  const {
    product_name,
    meta_title,
    meta_description,
    product_code,
    base_price,
    tax_class,
    gst_amount,
    status,
    discount_type,
    description,
    dimension_unit,
    length,
    width,
    height,
    weight_unit,
    weight,
    variations,
    categories,
    product_type,
    tags,
    discount,
  } = req.body;

  try {
    // 1. Update product main record
    const { data: updatedProduct, error: productError } = await supabase
      .from("products")
      .update({
        product_name,
        product_code,
        base_price,
        tax_class,
        gst_amount: gst_amount || 0,
        status: status || "Draft",
        discount_type: discount_type || "no-discount",
        discount: discount || null,
        description,
        meta_description,
        meta_title,
      })
      .eq("id", productId)
      .select()
      .single();

    if (productError) throw productError;

    // 2. Update product_dimensions (assuming one record per product)
    if (dimension_unit && weight_unit) {
      // Check if dimension record exists
      const { data: existingDimensions, error: dimError } = await supabase
        .from("product_dimensions")
        .select("*")
        .eq("product_id", productId)
        .single();

      if (dimError && dimError.code !== "PGRST116") {
        // PGRST116 = no rows found, so ignore if no rows
        throw dimError;
      }

      if (existingDimensions) {
        // Update existing
        const { error: updateDimError } = await supabase
          .from("product_dimensions")
          .update({
            dimension_unit,
            length,
            width,
            height,
            weight_unit,
            weight,
          })
          .eq("product_id", productId);

        if (updateDimError) throw updateDimError;
      } else {
        // Insert new dimensions
        const { error: insertDimError } = await supabase
          .from("product_dimensions")
          .insert({
            product_id: productId,
            dimension_unit,
            length,
            width,
            height,
            weight_unit,
            weight,
          });

        if (insertDimError) throw insertDimError;
      }
    }

    // 3. Update product_categories (replace all)
    if (categories) {
      // Delete old links
      await supabase
        .from("product_categories")
        .delete()
        .eq("product_id", productId);

      if (categories.length > 0) {
        const categoryLinks = categories.map((cat) => ({
          product_id: productId,
          category_id: cat.id,
        }));
        const { error: catInsertError } = await supabase
          .from("product_categories")
          .insert(categoryLinks);

        if (catInsertError) throw catInsertError;
      }
    }

    // 4. Update product_product_types (replace all)
    if (product_type) {
      await supabase
        .from("product_product_types")
        .delete()
        .eq("product_id", productId);

      if (product_type.length > 0) {
        const typeLinks = product_type.map((type) => ({
          product_id: productId,
          type_id: type.id,
        }));
        const { error: typeInsertError } = await supabase
          .from("product_product_types")
          .insert(typeLinks);

        if (typeInsertError) throw typeInsertError;
      }
    }

    // 5. Update product_tags (replace all)
    if (tags) {
      await supabase.from("product_tags").delete().eq("product_id", productId);

      if (tags.length > 0) {
        const tagLinks = tags.map((tag) => ({
          product_id: productId,
          tag_id: tag.id,
        }));
        const { error: tagInsertError } = await supabase
          .from("product_tags")
          .insert(tagLinks);

        if (tagInsertError) throw tagInsertError;
      }
    }

    // 6. Update product_variations (replace all)
    if (variations) {
      await supabase
        .from("product_variations")
        .delete()
        .eq("product_id", productId);

      if (variations.length > 0) {
        const variationRecords = variations.map((v) => ({
          product_id: productId,
          variation_type: v.type,
          variation_value: v.value,
        }));
        const { error: varInsertError } = await supabase
          .from("product_variations")
          .insert(variationRecords);

        if (varInsertError) throw varInsertError;
      }
    }

    // Optionally, fetch product images if you want to return them here as well
    const { data: productImages, error: imagesError } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId);

    if (imagesError) throw imagesError;

    // Return updated product with images
    res.status(200).json({
      success: true,
      product: {
        ...updatedProduct,
        product_images: productImages || [],
      },
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

module.exports = router;
