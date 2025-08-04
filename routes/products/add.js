// need to return the product images as well
const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig"); // Adjust the path as necessary

// Get all products (API endpoint, not the EJS page render)
router.post("/", async (req, res) => {
  // console.log("in");

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
    // 1. Insert product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        product_name: product_name,
        product_code: product_code,
        base_price: base_price,
        tax_class: tax_class,
        gst_amount: gst_amount || 0,
        status: status || "Draft",
        discount_type: discount_type || "no-discount",
        discount: discount || null,
        description,
        meta_description,
        meta_title,
      })
      .select()
      .single();

    if (productError) throw productError;

    const productId = product.id;

    // 2. Prepare insertions in parallel
    const tasks = [];

    if (dimension_unit && weight_unit) {
      tasks.push(
        supabase.from("product_dimensions").insert({
          product_id: productId,
          dimension_unit: dimension_unit,
          length,
          width,
          height,
          weight_unit: weight_unit,
          weight,
        })
      );
    }

    if (categories?.length) {
      const categoryLinks = categories.map((cat) => ({
        product_id: productId,
        category_id: cat.id,
      }));
      tasks.push(supabase.from("product_categories").insert(categoryLinks));
    }

    if (product_type?.length) {
      const typeLinks = product_type.map((type) => ({
        product_id: productId,
        type_id: type.id,
      }));
      tasks.push(supabase.from("product_product_types").insert(typeLinks));
    }

    if (tags?.length) {
      const tagLinks = tags.map((tag) => ({
        product_id: productId,
        tag_id: tag.id,
      }));
      tasks.push(supabase.from("product_tags").insert(tagLinks));
    }

    if (variations?.length) {
      const variationRecords = variations.map((v) => ({
        product_id: productId,
        variation_type: v.type,
        variation_value: v.value,
      }));
      tasks.push(supabase.from("product_variations").insert(variationRecords));
    }

    // 3. Execute all insertions in parallel
    const results = await Promise.all(tasks);

    // 4. Check for any errors
    for (const result of results) {
      if (result.error) throw result.error;
    }

    res
      .status(201)
      .json({ success: true, product: { ...product, product_images: [] } });
  } catch (error) {
    console.error("❌ Error saving product:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

module.exports = router;
