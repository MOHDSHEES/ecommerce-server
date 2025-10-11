const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/createOrder", require("./createOrder"));
router.use("/getCouriers", require("./getCouriers"));
router.use("/assignCourier", require("./assignCourier"));
router.use("/track", require("./track"));
router.use("/getSavedAddress", require("./getSavedAddress"));
router.use("/assignPickup", require("./assignPickup"));
router.use("/fullShipRocketFlow", require("./fullShipRocketFlow"));
// router.use("/retryFlow", require("./retryFlow"));
router.use("/getDetails", require("./getDetails"));

module.exports = router;
