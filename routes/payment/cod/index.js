const express = require("express");
const router = express.Router();

router.use("/createOrder", require("./createOrder"));

module.exports = router;
