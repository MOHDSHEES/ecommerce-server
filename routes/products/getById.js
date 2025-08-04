// // routes/products/getById.js
// const express = require("express");
// const router = express.Router();
// const { supabase } = require("../../config/supabaseConfig");

// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const { data, error } = await supabase
//       .from("products")
//       .select(
//         "*, product_images(*),product_dimensions(*), product_variations(*), product_categories(id, categories(*))"
//       )
//       .eq("id", id)
//       .single(); // because we're fetching a single item

//     if (error) {
//       return res.status(500).json({ success: false, message: error.message });
//     }
//     console.log(data);

//     if (!data) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     // Flattening
//     const {
//       product_images,
//       product_dimensions,
//       product_variations,
//       product_categories,
//       ...rest
//     } = data;

//     const flatProduct = {
//       ...rest,
//       ...(Array.isArray(product_dimensions) && product_dimensions.length > 0
//         ? product_dimensions[0]
//         : {}),
//       ...(Array.isArray(product_images) && product_images.length > 0
//         ? product_images[0]
//         : {}),
//       ...(Array.isArray(product_variations) && product_variations.length > 0
//         ? product_variations[0]
//         : {}),
//       ...(Array.isArray(product_categories) && product_categories.length > 0
//         ? product_categories[0].categories
//         : {}),
//     };

//     res.status(200).json({
//       success: true,
//       product: flatProduct,
//     });

//     // res.status(200).json({ success: true, product: data });
//   } catch (err) {
//     console.error("Error fetching product by ID:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  try {
    // Fetch product with joins
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_images(id, url, is_primary),
        product_dimensions( width,
      height,
      length,
      weight,
      product_id,
      weight_unit,
      dimension_unit),
        product_variations(id, variation_type, variation_value),
        product_categories(id, categories(id, name)),
        product_product_types(id, types:product_types(id, name)),
        product_tags(id, tags(id, name))
      `
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    // console.log(data);

    if (!data) {
      // No product found, but no error from Supabase
      return res
        .status(404)
        .json({ success: false, product: null, message: "Product not found" });
    }

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const {
      product_dimensions,
      product_images,
      product_variations,
      product_categories,
      product_product_types,
      product_tags,
      ...baseProduct
    } = data;

    // Flatten and normalize
    const flatProduct = {
      ...baseProduct,
      ...(Array.isArray(product_dimensions) && product_dimensions.length > 0
        ? product_dimensions[0]
        : {}),
      ...(product_images?.find((img) => img.is_primary) || {}),
      variations:
        product_variations?.map((v) => ({
          id: v.id,
          type: v.variation_type,
          value: v.variation_value,
        })) || [],
      categories: product_categories?.map((c) => c.categories) || [],
      product_type: product_product_types?.map((pt) => pt.types) || [],
      tags: product_tags?.map((t) => t.tags) || [],
    };
    // console.log(flatProduct);

    res.status(200).json({
      success: true,
      product: flatProduct,
    });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
