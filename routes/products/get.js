const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// POST /api/products/get
router.post("/", async (req, res) => {
  // console.log("in");

  const { page = 1, limit = 10, filters = {} } = req.body;
  const offset = (page - 1) * limit;

  try {
    // Build Supabase query
    let query = supabase
      .from("products")
      .select("*,product_images(id,url)", { count: "exact" })
      .range(offset, offset + limit - 1);

    // Apply filters dynamically
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== "") {
        query = query.eq(key, filters[key]);
      }
    });

    const { data: products, count, error } = await query;

    if (error) {
      // console.log(error);

      return res.status(500).json({ success: false, message: error.message });
    }

    const pages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      products,
      total: count,
      pages,
      page,
      limit,
    });
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
