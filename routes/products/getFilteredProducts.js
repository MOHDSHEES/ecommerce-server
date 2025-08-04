const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// POST /api/products/get
router.post("/", async (req, res) => {
  // console.log("in");
  const { page = 1, limit = 10, filters = {} } = req.body;
  const offset = (page - 1) * limit;
  //   console.log(filters);

  try {
    const { data, error } = await supabase.rpc("get_filtered_products", {
      _tag_name: filters.tag || null,
      _category_name: filters.category || null,
      _status: filters.status || null, // Accepts 'Active', 'Inactive', or 'All'
      _limit: limit,
      _offset: offset,
    });
    // console.log(error);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    // console.log(data);

    res.status(200).json({
      success: true,
      products: data,
      page,
      limit,
    });
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
