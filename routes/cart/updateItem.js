const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// POST /api/cart
router.post("/", async (req, res) => {
  const { cart_id, newQuantity } = req.body;

  //   console.log(user_id);

  //   console.log(product_id);
  //   console.log(quantity);
  //   console.log(variation_ids);

  if (!cart_id) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // Step 1: Fetch all cart items for this user + product
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity }) // newQuantity is the updated value
      .eq("id", cart_id);

    if (error) throw error;

    res.json({
      message: "Cart item updated successfully",
      success: true,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
