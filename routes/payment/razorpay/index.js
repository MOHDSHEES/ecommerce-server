const express = require("express");
const router = express.Router();

router.use("/createOrder", require("./createOrder"));
router.use("/verifyPayment", require("./verifyPayment"));

module.exports = router;
