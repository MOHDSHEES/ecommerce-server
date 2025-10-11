const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// POST /api/orders/get
router.post("/", async (req, res) => {
  const { order_id } = req.body;
  //   console.log(order_id);

  try {
    // Fetch order + related order_items
    const { data: ord, error: orderr } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", order_id)
      .single(); // expect one order
    // console.log(ord);

    if (orderr) {
      //   console.log(orderr);

      return res.status(500).json({ success: false, message: orderr.message });
    }
    if (!ord)
      return res
        .status(500)
        .json({ success: false, message: "No Order found." });
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order_id);

    if (error) {
      console.log(error);

      return res.status(500).json({ success: false, message: error.message });
    }
    // console.log(data);

    res.status(200).json({
      success: true,
      data: { order: ord, products: data },
    });
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
