// need to return the product images as well
const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig"); // Adjust the path as necessary

router.post("/", async (req, res) => {
  // console.log("in");

  const { user: data } = req.body;
  //   console.log(data);

  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert(data)
      .select()
      .single();
    // console.log(address);
    // console.log(addressError);

    if (userError) throw userError;

    res.status(201).json({ success: true, user: user });
  } catch (error) {
    console.error("❌ Error saving product:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

module.exports = router;
