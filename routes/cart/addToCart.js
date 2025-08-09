const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// POST /api/cart
router.post("/", async (req, res) => {
  const { user_id, product_id, quantity = 1, variation_ids = [] } = req.body;
  //   console.log(user_id);

  //   console.log(product_id);
  //   console.log(quantity);
  //   console.log(variation_ids);

  if (
    !user_id ||
    !product_id ||
    quantity <= 0 ||
    !Array.isArray(variation_ids)
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // Step 1: Fetch all cart items for this user + product
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("id")
      .eq("user_id", user_id)
      .eq("product_id", product_id);

    if (cartError) throw cartError;

    let matchedCartItem = null;

    // Step 2: For each cart item, fetch its variations and compare with requested
    for (const item of cartItems) {
      const { data: existingVariations, error: varError } = await supabase
        .from("product_variation_selections")
        .select("variation_id")
        .eq("cart_item_id", item.id);

      if (varError) throw varError;

      // Extract variation IDs from existingVariations
      const existingVarIds = existingVariations
        .map((v) => v.variation_id)
        .sort();
      const inputVarIds = [...variation_ids].sort();

      // Compare arrays (equal if same length and same elements)
      if (
        existingVarIds.length === inputVarIds.length &&
        existingVarIds.every((val, idx) => val === inputVarIds[idx])
      ) {
        matchedCartItem = item;
        break;
      }
    }

    if (matchedCartItem) {
      // Step 3: If matched cart item found, update its quantity
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: quantity })
        .eq("id", matchedCartItem.id);

      if (updateError) throw updateError;

      res.json({
        message: "Cart item quantity updated",
        data: { cart_item_id: matchedCartItem.id },
      });
    } else {
      // Step 4: No match - insert new cart item
      const { data: newCartItem, error: insertCartError } = await supabase
        .from("cart_items")
        .insert([{ user_id, product_id, quantity }])
        .select()
        .single();

      if (insertCartError) throw insertCartError;

      const cartItemId = newCartItem.id;

      // Insert all variation selections for the new cart item
      const variationRows = variation_ids.map((vid) => ({
        cart_item_id: cartItemId,
        variation_id: vid,
      }));

      const { error: insertVarError } = await supabase
        .from("product_variation_selections")
        .insert(variationRows);

      if (insertVarError) throw insertVarError;

      res.json({
        message: "Cart item created",
        data: { cart_item_id: cartItemId },
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
