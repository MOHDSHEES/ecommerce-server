const express = require("express");
// const { getShiprocketToken } = require("./getShiprocketToken");
const { assignPickup } = require("./services/shiprocket");
const router = express.Router();

// POST /api/shiprocket/shipment/pickup
router.post("/", async (req, res) => {
  try {
    const data = await assignPickup(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Shiprocket pickup generation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
