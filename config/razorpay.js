// /config/razorpay.js
const Razorpay = require("razorpay");
require("dotenv").config();

async function createRazorpayInstance() {
  //   console.log(process.env.RAZORPAY_KEY_ID);

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

module.exports = { createRazorpayInstance };
