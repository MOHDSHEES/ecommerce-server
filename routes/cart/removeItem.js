const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// POST /api/cart
router.delete("/", async (req, res) => {
  const { cart_id } = req.body;

  //   console.log(user_id);

  //   console.log(product_id);
  //   console.log(quantity);
  //   console.log(variation_ids);

  if (!cart_id) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // Step 1: Fetch all cart items for this user + product
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cart_id);

    if (cartError) throw cartError;

    const { data, error } = await supabase
      .from("product_variation_selections")
      .delete()
      .eq("cart_item_id", cart_id);
    // Step 2: For each cart item, fetch its variations and compare with requested

    res.json({
      message: "Cart item deleted successfully",
      success: true,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
