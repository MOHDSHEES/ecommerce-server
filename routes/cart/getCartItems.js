const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// GET /api/cart?user_id=123
router.post("/", async (req, res) => {
  const { user_id } = req.body;
  //   console.log("in getCartItems");

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  try {
    // Step 1: Fetch all cart items for the user
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("*,products(*)")
      .eq("user_id", user_id);

    if (cartError) throw cartError;

    // Step 2: For each cart item, fetch its variations with full details
    const cartItemsWithVariations = await Promise.all(
      cartItems.map(async (item) => {
        // Join product_variation_selections with variations
        const { data: variations, error: varError } = await supabase
          .from("product_variation_selections")
          .select("variation_id, product_variations ( *)")
          .eq("cart_item_id", item.id);

        if (varError) throw varError;
        // console.log(variations);

        const variationDetails = variations.map((v) => v.product_variations);

        // Step 2: Get all unique product IDs from the cart
        const productIds = [
          ...new Set(cartItems.map((item) => item.product_id)),
        ];

        // Step 3: Fetch ONE image per product in a single query
        const { data: productImages, error: imgError } = await supabase
          .from("product_images")
          .select("product_id, url") // assuming "image_url" is your image column
          .in("product_id", productIds);

        if (imgError) throw imgError;

        // Map product_id -> first image
        const imageMap = {};
        productImages.forEach((img) => {
          if (!imageMap[img.product_id]) {
            imageMap[img.product_id] = img.url;
          }
        });

        return {
          ...item,
          variations: variationDetails,
          image: imageMap[item.product_id] || null,
        };
      })
    );

    res.json({
      message: "Cart items fetched successfully",
      data: cartItemsWithVariations,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
