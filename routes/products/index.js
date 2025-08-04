const express = require("express");
const router = express.Router();

const addProduct = require("./add");
const fetchCategories = require("./fetchCategories.js");
const getProducts = require("./get");
// const deleteProduct = require("./delete");
// const updateProduct = require("./update");

// Mount individual route handlers

router.use("/fetch-categories", fetchCategories);
router.use("/get", getProducts);
router.use("/add", addProduct);
router.use("/getById", require("./getById"));
router.use("/getFilteredProducts", require("./getFilteredProducts"));
router.use("/update", require("./update"));
// router.delete("/:id", deleteProduct);
// router.put("/:id", updateProduct);

module.exports = router;
