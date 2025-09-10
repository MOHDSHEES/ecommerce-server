const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// POST /api/orders/get
router.post("/", async (req, res) => {
  const { page = 1, limit = 10, filters = {} } = req.body;
  const offset = (page - 1) * limit;

  try {
    // Start query
    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filters.payment_status) {
      query = query.eq("payment_status", filters.payment_status);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.amount_gt) {
      query = query.gt("amount", filters.amount_gt);
    }

    if (filters.amount_lt) {
      query = query.lt("amount", filters.amount_lt);
    }

    if (filters.amount_gte) {
      query = query.gte("amount", filters.amount_gte);
    }

    if (filters.amount_lte) {
      query = query.lte("amount", filters.amount_lte);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.status(200).json({
      success: true,
      orders: data,
      total: count,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
