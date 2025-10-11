const express = require("express");
// const fetch = require("node-fetch");
// const { getShiprocketToken } = require("./getShiprocketToken");
const { assignAWB } = require("./services/shiprocket");
const router = express.Router();

// POST /api/shiprocket/shipment/assign
router.post("/", async (req, res) => {
  try {
    const data = await assignAWB(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Shiprocket shipment assign error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
