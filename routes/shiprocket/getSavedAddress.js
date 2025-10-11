const express = require("express");
const { getShiprocketToken } = require("./getShiprocketToken");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = await getShiprocketToken();

    const response = await fetch(
      "https://apiv2.shiprocket.in/v1/external/settings/company/pickup",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching pickup locations:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
