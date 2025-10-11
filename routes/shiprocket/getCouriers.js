const express = require("express");
const { getShiprocketToken } = require("./getShiprocketToken");
const router = express.Router();

// POST /api/shiprocket/couriers
router.post("/", async (req, res) => {
  try {
    const token = await getShiprocketToken();
    // console.log(req.body);
    const {
      pickup_postcode,
      delivery_postcode,
      weight,
      length,
      width,
      height,
      cod,
    } = req.body;

    // Validate required fields
    if (
      !pickup_postcode ||
      !delivery_postcode ||
      !weight ||
      !length ||
      !width ||
      !height ||
      cod === undefined
    ) {
      //   console.log("Missing required fields");

      return res.status(400).json({
        success: false,
        message:
          "pickup_postcode, delivery_postcode, weight, length, width, height, and cod are required",
      });
    }

    const url = new URL(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability"
    );
    url.searchParams.append("pickup_postcode", pickup_postcode);
    url.searchParams.append("delivery_postcode", delivery_postcode);
    url.searchParams.append("weight", weight);
    url.searchParams.append("length", length);
    url.searchParams.append("width", width);
    url.searchParams.append("height", height);
    url.searchParams.append("cod", cod);

    // Make GET request
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    // console.log(response);

    const data = await response.json();
    // console.log(data);

    res.json({ success: true, data });
  } catch (err) {
    console.error("Shiprocket courier error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
