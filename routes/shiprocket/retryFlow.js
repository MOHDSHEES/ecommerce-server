// const express = require("express");
// const router = express.Router();

// const { assignAWB, assignPickup } = require("./services/shiprocket");
// const { updateOrderService } = require("../order/services/order");
// const { supabase } = require("../../config/supabaseConfig");
// // const { getOrderById, updateOrderService } = require("../order/services/order");

// const SHIPROCKET_STATUS_MAP = {
//   1: "New",
//   2: "In Progress",
//   3: "Shipped",
//   4: "Out for Delivery",
//   5: "Delivered",
//   6: "RTO Initiated",
//   7: "Returned",
//   8: "Cancelled",
// };

// router.post("/", async (req, res) => {
//   try {
//     // console.log("inn");

//     const { order_id, courier_id, pickup_date } = req.body;

//     if (!order_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "order_id is required" });
//     }

//     // Fetch order info
//     const { data: order, error: orderr } = await supabase
//       .from("orders")
//       .select("*")
//       .eq("order_id", order_id)
//       .single(); // expect one order
//     // const order = await getOrderById(order_id);
//     if (!order || orderr) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });
//     }

//     const { shipment_workflow, shipment_id, dimensions } = order;

//     let awbData = null;
//     let pickupData = null;

//     // Step 1: Retry AWB assignment if workflow is order_created
//     if (shipment_workflow === "order_created") {
//       if (!courier_id) {
//         return res.status(400).json({
//           success: false,
//           message: "courier_id is required for AWB assignment",
//         });
//       }

//       awbData = await assignAWB({
//         shipment_id,
//         courier_id,
//       });
//       console.log(awbData);

//       if (!awbData?.data?.awb_code) {
//         return res
//           .status(500)
//           .json({
//             success: false,
//             message: awbData.message || "AWB assignment failed",
//           });
//       }

//       const shippingStatusCode = awbData.data.status_code || 1;
//       const shippingStatus = SHIPROCKET_STATUS_MAP[shippingStatusCode];

//       await updateOrderService({
//         order_id,
//         updated_data: {
//           awb_code: awbData.data.awb_code,
//           shipping_status: shippingStatus,
//           shipment_workflow: "awb_assigned",
//         },
//       });
//     }

//     // Step 2: Retry Pickup scheduling if workflow is order_created or awb_assigned
//     if (
//       shipment_workflow === "order_created" ||
//       shipment_workflow === "awb_assigned"
//     ) {
//       if (!pickup_date) {
//         return res.status(400).json({
//           success: false,
//           message: "pickup_date is required for pickup scheduling",
//         });
//       }

//       pickupData = await assignPickup({
//         shipment_id,
//         pickup_date,
//       });
//       //   console.log(pickupData);

//       if (!pickupData?.data) {
//         // console.log(pickupData.message);
//         return res.status(500).json({
//           success: false,
//           message: pickupData.message || "Pickup scheduling failed",
//         });
//       }

//       await updateOrderService({
//         order_id,
//         updated_data: {
//           shipment_workflow: "pickup_scheduled",
//         },
//       });
//     }

//     res.json({
//       success: true,
//       data: {
//         awbData,
//         pickupData,
//         shipment_workflow: order.shipment_workflow,
//       },
//     });
//   } catch (err) {
//     console.error("Retry flow error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;
