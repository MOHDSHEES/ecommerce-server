const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// POST /api/orders/update
router.post("/", async (req, res) => {
  const { order_id, status, payment_status } = req.body;
  //   console.log("in");
  //   console.log(order_id);
  //   console.log(status);
  //   console.log(payment_status);

  if (!order_id) {
    return res
      .status(400)
      .json({ success: false, message: "order_id is required" });
  }

  try {
    // Build the update object dynamically
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (payment_status !== undefined)
      updateData.payment_status = payment_status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No status fields provided to update",
      });
    }
    // console.log(updateData);

    // Update the order in Supabase
    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("order_id", order_id)
      .select(); // return updated row

    if (error) throw error;
    // console.log(data);
    // console.log(error);

    res.json({ success: true, message: "Order updated", data });
  } catch (err) {
    console.error("Order update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
