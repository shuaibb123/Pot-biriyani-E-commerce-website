const Order = require("./orderModel"); // Adjust path accordingly

// Fetch and log orders function
const fetchAndLogOrders = async () => {
  try {
    // Fetch all orders
    const orders = await Order.find();
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
};

module.exports = fetchAndLogOrders;
