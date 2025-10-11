const { supabase } = require("../../../config/supabaseConfig");

async function updateOrderService({ order_id, updated_data }) {
  if (!order_id) {
    throw new Error("order_id is required");
  }

  if (!updated_data || Object.keys(updated_data).length === 0) {
    throw new Error("No fields provided to update");
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updated_data)
    .eq("order_id", order_id)
    .select(); // return updated row

  if (error) throw new Error(error.message);

  return data;
}

module.exports = { updateOrderService };
