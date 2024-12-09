const express = require("express");
const router = express.Router();
const Order = require("./orderModel");
const authenticateToken = require("./authMiddleware");
const { body, validationResult } = require("express-validator");

function generateOrderId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let orderId = "";
  for (let i = 0; i < 6; i++) {
    orderId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return orderId;
}

// Place an Order
router.post("/", authenticateToken, async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { items, totalPrice, shippingDetails, paymentDetails } = req.body;
  const userId = req.user.id;

  try {
    const orderId = generateOrderId(); // Generate random order ID

    // Create the order
    const newOrder = new Order({
      userId,
      orderId, // Assign generated order ID here
      items,
      totalPrice,
      shippingDetails,
      paymentDetails,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get User Orders
router.get("/", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Single Order by ID (Admin or Owner)
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (req.user.id !== order.userId.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/admin/fetch-orders", authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Fetch all orders
    const orders = await Order.find();

    // Log all orders to the console
    console.log("All Orders:", orders);

    // Send a response to the client
    res.status(200).json({ message: "Orders fetched and logged to console" });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/admin/orderDetails/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch the order details from the database
    const order = await Order.findById(orderId).populate("items.product"); // Assuming items are populated with product details

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).exec(); // Fetch orders by userId

    // Optional: Log the fetched orders to verify structure
    console.log("Fetched Orders:", orders);

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
