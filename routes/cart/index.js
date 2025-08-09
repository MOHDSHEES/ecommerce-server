const express = require("express");
const router = express.Router();

// const deleteProduct = require("./delete");
// const updateProduct = require("./update");

// Mount individual route handlers

router.use("/addToCart", require("./addToCart"));
router.use("/getCartItems", require("./getCartItems"));
// router.delete("/:id", deleteProduct);
// router.put("/:id", updateProduct);

module.exports = router;
