const express = require("express");
const { getShiprocketToken } = require("./getShiprocketToken");
const router = express.Router();

// GET /api/shiprocket/shipment/details?id=123&type=shipment
router.post("/", async (req, res) => {
  const token = await getShiprocketToken();
  const { id, type } = req.body; // type can be "shipment" or "order"
  // console.log(id);
  // console.log(type);

  if (!id || !type) {
    return res
      .status(400)
      .json({ success: false, message: "id and type are required" });
  }

  try {
    let url = "";

    if (type === "shipment") {
      // Get by shipment_id
      url = `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${id}`;
    } else if (type === "order") {
      // Get by shipment_order_id
      url = `https://apiv2.shiprocket.in/v1/external/orders/show/${id}`;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use 'shipment' or 'order'",
      });
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response);

    const data = await response.json();
    // console.log(data);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.message || "Failed to fetch details",
      });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching shipment details:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
