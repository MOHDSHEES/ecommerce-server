// need to return the product images as well
const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig"); // Adjust the path as necessary

router.post("/", async (req, res) => {
  // console.log("in");

  const { addressId } = req.body;
  //   console.log(data);
  if (!addressId) {
    return res
      .status(400)
      .json({ success: false, message: "addressId is required" });
  }
  try {
    const { data: address, error: addressError } = await supabase
      .from("user_addresses")
      .delete()
      .eq("id", addressId);
    // console.log(address);
    // console.log(addressError);

    if (addressError) throw addressError;

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting address:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

module.exports = router;
