// /routes/orderRoutes.js
const express = require("express");
const crypto = require("crypto");
const { supabase } = require("../../../config/supabaseConfig");
// import { createRazorpayInstance } from "../../../config/razorpay";

const router = express.Router();
router.post("/", async (req, res) => {
  //   console.log("in");

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    // console.log(razorpay_order_id);
    // console.log(razorpay_payment_id);
    // console.log(razorpay_signature);

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");
    // console.log(digest);

    if (digest === razorpay_signature) {
      //   console.log("in");

      await supabase
        .from("orders")
        .update({
          razorpay_payment_id,
          razorpay_signature,
          payment_status: "paid",
        })
        .eq("order_id", razorpay_order_id);
      return res.json({
        success: true,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          status: "cancelled",
        })
        .eq("order_id", razorpay_order_id);
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("❌ Verification failed:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
