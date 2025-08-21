const express = require("express");
const router = express.Router();

router.use("/add-address", require("./add-address"));
router.use("/get-address", require("./get-address"));

module.exports = router;
