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
      .select("*")
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

        return {
          ...item,
          variations: variationDetails,
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
