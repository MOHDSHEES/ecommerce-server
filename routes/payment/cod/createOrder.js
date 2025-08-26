const express = require("express");
// const { createRazorpayInstance } = require("../../../config/razorpay");
const { supabase } = require("../../../config/supabaseConfig");
const router = express.Router();
const crypto = require("crypto");

function generateOrderId() {
  if (typeof crypto !== "undefined" && crypto.randomBytes) {
    // Node.js crypto
    return "order_" + crypto.randomBytes(10).toString("hex").slice(0, 14);
  } else if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    // WebCrypto (Edge/browser)
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return (
      "order_" +
      Array.from(array)
        .map((n) => n.toString(16))
        .join("")
        .slice(0, 14)
    );
  } else {
    // Fallback
    return "order_" + Math.random().toString(36).substring(2, 16);
  }
}

router.post("/", async (req, res) => {
  //   console.log("inn");

  try {
    const {
      user_id,
      amount,
      currency = "INR",
      billing_address,
      shipping_address,
      payment_type = "COD",
    } = req.body;
    // console.log(amount);
    console.log(payment_type);
    console.log(user_id);

    // console.log(user_id);
    // console.log(amount);
    // console.log(billing_address);

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 2️⃣ Insert order into Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          order_id: generateOrderId(),
          amount,
          currency,
          status: "pending",
          payment_type,
          billing_address,
          shipping_address,
        },
      ])
      .select()
      .single(); // get the inserted row
    // console.log(data);

    if (error) {
      console.error("❌ Failed to insert order into DB:", error);
      return res.status(500).json({ error: error.message });
    }

    // 3️⃣ Respond with Razorpay order and key_id
    res.json({ order: null, dbOrder: data, key_id: null });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
