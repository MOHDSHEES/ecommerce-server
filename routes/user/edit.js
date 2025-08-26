// need to return the product images as well
const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig"); // Adjust the path as necessary

router.post("/", async (req, res) => {
  // console.log("in");

  const { userId, updated_user } = req.body;
  //   console.log(data);
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User Id is required" });
  }
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .update(updated_user)
      .eq("id", userId)
      .select()
      .single();
    // console.log(address);
    // console.log(addressError);
    // console.log(user);

    if (userError) throw userError;

    res.status(201).json({ success: true, user: user });
  } catch (error) {
    console.error("❌ Error saving product:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

module.exports = router;
