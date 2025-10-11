const express = require("express");
// const fetch = require("node-fetch");
// const { getShiprocketToken } = require("./getShiprocketToken");
const { createShiprocketOrder } = require("./services/shiprocket");
const router = express.Router();

// POST /api/shiprocket/orders
router.post("/", async (req, res) => {
  try {
    const data = await createShiprocketOrder(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Create Shiprocket order error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
