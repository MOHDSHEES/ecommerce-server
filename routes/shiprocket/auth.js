const express = require("express");
const { getShiprocketToken } = require("./getShiprocketToken");
const router = express.Router();

// GET /api/shiprocket/auth/token
router.get("/token", async (req, res) => {
  try {
    const token = await getShiprocketToken();
    res.json({ success: true, token });
  } catch (err) {
    console.error("Shiprocket auth error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
