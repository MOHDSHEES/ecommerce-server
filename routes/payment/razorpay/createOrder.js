const express = require("express");
const { createRazorpayInstance } = require("../../../config/razorpay");
const { supabase } = require("../../../config/supabaseConfig");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      amount,
      currency = "INR",
      billing_address,
      shipping_address,
    } = req.body;
    // console.log(amount);
    // console.log(user_id);
    // console.log(amount);
    // console.log(billing_address);

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 1️⃣ Create order in Razorpay
    const razorpay = await createRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
    });

    // 2️⃣ Insert order into Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          razorpay_order_id: razorpayOrder.id,
          amount,
          currency,
          status: "pending",
          billing_address,
          shipping_address,
        },
      ])
      .select()
      .single(); // get the inserted row

    if (error) {
      console.error("❌ Failed to insert order into DB:", error);
      return res.status(500).json({ error: error.message });
    }

    // 3️⃣ Respond with Razorpay order and key_id
    res.json({ order: razorpayOrder, dbOrder: data, key_id: razorpay.key_id });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
