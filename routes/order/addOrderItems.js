const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// POST /api/orders/items
router.post("/", async (req, res) => {
  const { order_id, order_items } = req.body;

  if (!order_id) {
    return res
      .status(400)
      .json({ success: false, message: "order_id is required" });
  }

  if (!order_items || order_items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "order_items are required" });
  }

  try {
    // Map incoming items with order_id
    const mappedItems = order_items.map((item) => ({
      order_id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      price: item.price,
      quantity: item.quantity,
      variations: item.variations, // JSONB field
    }));

    // Insert into order_items
    const { data, error } = await supabase
      .from("order_items")
      .insert(mappedItems)
      .select(); // return inserted rows

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.status(201).json({
      success: true,
      message: "Order items inserted successfully",
      items: data,
    });
  } catch (err) {
    console.error("Order items insert error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
