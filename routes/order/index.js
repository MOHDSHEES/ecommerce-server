const express = require("express");
const router = express.Router();

router.use("/get", require("./get"));
router.use("/addOrderItems", require("./addOrderItems"));
router.use("/updateOrderStatus", require("./updateOrderStatus"));
router.use("/getNewOrders", require("./getNewOrders"));
router.use("/fetchOrderDetails", require("./fetchOrderDetails"));
router.use("/getOrderDetails", require("./getOrderDetails"));
router.use("/update", require("./updateOrder"));

module.exports = router;
