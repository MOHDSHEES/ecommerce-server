const express = require("express");
const router = express.Router();

router.use("/get", require("./get"));
router.use("/addOrderItems", require("./addOrderItems"));
router.use("/updateOrderStatus", require("./updateOrderStatus"));
router.use("/getNewOrders", require("./getNewOrders"));

module.exports = router;
