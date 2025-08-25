const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig"); // Adjust the path as necessary

router.post("/", async (req, res) => {
  const { email } = req.body;
  // console.log(email);

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }
  try {
    let { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

module.exports = router;
