const express = require("express");
// const fetch = require("node-fetch");
const { getShiprocketToken } = require("./getShiprocketToken");
const router = express.Router();

// GET /api/shiprocket/tracking/:awb
router.get("/:awb", async (req, res) => {
  try {
    const token = await getShiprocketToken();

    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${req.params.awb}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Shiprocket tracking error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
