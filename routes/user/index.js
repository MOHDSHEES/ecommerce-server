const express = require("express");
const router = express.Router();

router.use("/add-address", require("./add-address"));
router.use("/get-address", require("./get-address"));
router.use("/add", require("./add"));
router.use("/getByEmail", require("./getByEmail"));
router.use("/delete-address", require("./delete-address"));
router.use("/edit-address", require("./edit-address"));

module.exports = router;
