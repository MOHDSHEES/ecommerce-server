const express = require("express");
const router = express.Router();
// const { supabase } = require("../../config/supabaseConfig");
const { updateOrderService } = require("./services/order");

// POST /api/orders/update
router.post("/", async (req, res) => {
  const { order_id, updated_data } = req.body;
  try {
    const data = await updateOrderService({ order_id, updated_data });

    res.json({ success: true, message: "Order updated", data });
  } catch (err) {
    console.error("Order update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
