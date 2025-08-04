const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig");

// module.exports = async (req, res) => {
router.get("/", async (req, res) => {
  try {
    const [categoriesRes, tagsRes, typesRes] = await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("tags").select("*"),
      supabase.from("product_types").select("*"),
    ]);

    if (categoriesRes.error || tagsRes.error || typesRes.error) {
      return res.status(500).json({
        error:
          categoriesRes.error?.message ||
          tagsRes.error?.message ||
          typesRes.error?.message,
      });
    }

    res.json({
      categories: categoriesRes.data,
      tags: tagsRes.data,
      productTypes: typesRes.data,
    });
  } catch (error) {
    console.error("Error fetching meta:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
