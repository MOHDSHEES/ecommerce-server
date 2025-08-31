const express = require("express");
const router = express.Router();

router.use("/get", require("./get"));
router.use("/addOrderItems", require("./addOrderItems"));

module.exports = router;
