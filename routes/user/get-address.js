const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig"); // Adjust the path as necessary

router.post("/", async (req, res) => {
  const { user_id, type } = req.body;

  try {
    let query = supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", user_id);

    if (type) {
      query = query.eq("type", type); // filter only if type exists
    }

    const { data: address, error: addressError } = await query;

    if (addressError) throw addressError;

    res.status(200).json({ success: true, data: address });
  } catch (error) {
    console.error("❌ Error fetching addresses:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

module.exports = router;
