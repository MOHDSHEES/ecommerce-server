// need to return the product images as well
const express = require("express");
const router = express.Router();
const { supabase } = require("../../config/supabaseConfig"); // Adjust the path as necessary

router.post("/", async (req, res) => {
  // console.log("in");

  const da = req.body;
  const { extra, ...data } = da;
  //   console.log(data);
  //   console.log(extra);
  //   console.log(data);

  try {
    const { data: address, error: addressError } = await supabase
      .from("user_addresses")
      .update(data)
      .select()
      .eq("id", extra.addressId)
      .single();
    // console.log(address);
    // console.log(addressError);

    if (addressError) throw addressError;

    res.status(201).json({ success: true, address: address });
  } catch (error) {
    console.error("❌ Error saving product:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

module.exports = router;
