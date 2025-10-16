const express = require("express");
const router = express.Router();

const {
  createShiprocketOrder,
  // assignAWB,
  // assignPickup,
} = require("./services/shiprocket");
const { updateOrderService } = require("../order/services/order");
const { supabase } = require("../../config/supabaseConfig");

const SHIPROCKET_STATUS_MAP = {
  1: "New",
  2: "In Progress",
  3: "Shipped",
  4: "Out for Delivery",
  5: "Delivered",
  6: "RTO Initiated",
  7: "Returned",
  8: "Cancelled",
};
router.post("/", async (req, res) => {
  try {
    const { data } = req.body;
    // console.log(data);
    // console.log(pickup_date);

    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "data is required" });
    }

    // Step 1: Create order in Shiprocket
    const orderData = await createShiprocketOrder(data);
    // console.log("orderData", orderData);

    // Step 2: Save shipment_id and order_id in DB
    await updateOrderService({
      order_id: data.order_id,
      updated_data: {
        shipment_order_id: orderData.order_id,
        shipment_id: orderData.shipment_id,
        // shipment_workflow: "order_created",
        status: "processing",
        // dimensions: {
        //   length: data.length,
        //   breadth: data.breadth,
        //   height: data.height,
        //   weight: data.weight,
        // },
      },
    });

    // const { data: d, err } = await supabase
    //   .from("orders")
    //   .update({ status: "processing" })
    //   .eq("order_id", data.order_id);

    // // Step 3: Assign AWB if not already assigned
    // let awbData = null;
    // if (!orderData.awb_code) {
    //   awbData = await assignAWB({
    //     shipment_id: orderData.shipment_id,
    //     courier_id: data.courier_company_id, // optional if you want server to pick automatically
    //   });
    //   console.log("awbData", awbData);

    //   if (awbData?.data) {
    //     shippingStatusCode = awbData.data.status_code || shippingStatusCode;
    //     shippingStatus = SHIPROCKET_STATUS_MAP[shippingStatusCode];

    //     await updateOrderService({
    //       order_id: data.order_id,
    //       updated_data: {
    //         awb_code: awbData.data.awb_code,
    //         shipping_status: shippingStatus,
    //         shipment_workflow: "awb_assigned",
    //       },
    //     });
    //   }
    // }

    // // Step 4: Assign pickup if pickup_date is provided
    // let pickupData = null;
    // if (pickup_date) {
    //   pickupData = await assignPickup({
    //     shipment_id: orderData.shipment_id,
    //     pickup_date,
    //   });
    //   if (pickupData && !pickupData.error) {
    //     await updateOrderService({
    //       order_id: data.order_id,
    //       updated_data: {
    //         shipment_workflow: "pickup_scheduled",
    //       },
    //     });
    //   } else if (pickupData?.error) {
    //     console.warn("Pickup assignment failed:", pickupData.error);
    //   }
    // }

    res.json({
      success: true,
      data: orderData,
      // awbData,
      // pickupData,
    });
  } catch (err) {
    console.error("Full flow error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
