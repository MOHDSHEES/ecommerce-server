const express = require("express");
const router = express.Router();

router.use("/add-address", require("./add-address"));

module.exports = router;
