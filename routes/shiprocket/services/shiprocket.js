// const fetch = require("node-fetch");
const { getShiprocketToken } = require("../getShiprocketToken");

// 🔹 Create Order on Shiprocket
async function createShiprocketOrder(payload) {
  const token = await getShiprocketToken();

  const response = await fetch(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create order");
  return data;
}

// 🔹 Assign AWB
async function assignAWB(payload) {
  const token = await getShiprocketToken();

  const response = await fetch(
    "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // { shipment_id, courier_id }
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to assign AWB");
  return data;
}

// 🔹 Assign Pickup
async function assignPickup(payload) {
  const token = await getShiprocketToken();

  const response = await fetch(
    "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // { shipment_id, pickup_date, pickup_time, pickup_location }
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to assign pickup");
  return data;
}

module.exports = {
  createShiprocketOrder,
  assignAWB,
  assignPickup,
};
